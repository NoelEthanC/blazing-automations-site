"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { nanoid } from "nanoid";
import { ResourceCategory } from "@prisma/client";
import { supabase } from "@/lib/supabase";

// Fetch all published resources
export async function getPublishedResources() {
  try {
    const resources = await prisma.resource.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            downloads: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return resources;
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return [];
  }
}

// Fetch filtered published resources

const validCategories = ["All", ...Object.values(ResourceCategory)];

export async function getFilteredResources({
  search = "",
  category = "All",
  page = 1,
  perPage = 1,
}: {
  search?: string;
  category?: string;
  page?: number;
  perPage?: number;
}) {
  try {
    // Fallback if invalid category
    const safeCategory = validCategories.includes(category || "")
      ? category
      : "All";

    const whereClause = {
      published: true,
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      }),
      ...(safeCategory !== "All" && {
        category: safeCategory as ResourceCategory, // Replace 'any' with 'ResourceCategory' if you have the enum imported
      }),
    };

    const total = await prisma.resource.count({ where: whereClause });
    // const total = await prisma.resource.count()

    const resources = await prisma.resource.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            downloads: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: perPage,
      skip: (page - 1) * perPage,
    });

    return {
      resources,
      total,
      totalPages: Math.ceil(total / perPage),
      currentPage: page,
    };
  } catch (error) {
    console.error("Failed to fetch filtered resources:", error);
    return {
      resources: [],
      total: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
}

// Fetch featured resources for homepage
export async function getFeaturedResources() {
  try {
    const resources = await prisma.resource.findMany({
      where: {
        published: true,
        featured: true,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            downloads: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    });

    return resources;
  } catch (error) {
    console.error("Failed to fetch featured resources:", error);
    return [];
  }
}

// Fetch single resource by slug
// export async function getResourceBySlug(slug: string) {
//   try {
//     const resource = await prisma.resource.findUnique({
//       where: {
//         slug,
//         published: true,
//       },
//       include: {
//         author: {
//           select: {
//             firstName: true,
//             lastName: true,
//             email: true,
//           },
//         },
//         downloads: {
//           select: {
//             id: true,
//             createdAt: true,
//             email: true,
//           },
//           orderBy: {
//             createdAt: "desc",
//           },
//           take: 10,
//         },
//       },
//     });

//     return resource;
//   } catch (error) {
//     console.error("Failed to fetch resource:", error);
//     return null;
//   }
// }

// Get resource by slug with related resources
export async function getResourceBySlug(slug: string) {
  try {
    const resource = await prisma.resource.findUnique({
      where: {
        slug,
        published: true,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            downloads: true,
          },
        },
      },
    });

    if (!resource) {
      return null;
    }

    // Get related resources (same category, excluding current)
    const relatedResources = await prisma.resource.findMany({
      where: {
        published: true,
        // category: resource.category as ResourceCategory,
        id: {
          not: resource.id,
        },
      },
      include: {
        _count: {
          select: {
            downloads: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return {
      resource: {
        ...resource,
        downloadsCount: resource._count.downloads,
      },
      relatedResources: relatedResources.map((r) => ({
        ...r,
        downloadsCount: r._count.downloads,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch resource:", error);
    return null;
  }
}

// Admin: Fetch all resources
export async function getAllResources() {
  try {
    await requireAdmin();

    const resources = await prisma.resource.findMany({
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            downloads: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return resources;
  } catch (error) {
    console.error("Failed to fetch all resources:", error);
    return [];
  }
}

async function uploadFile(file: File, bucket: string, pathPrefix = "") {
  const fileExt = file.name.split(".").pop();
  const fileName = `${pathPrefix}-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  return urlData.publicUrl;
}

// Admin: Create new resource
// export async function createResource(prevState: any, formData: FormData) {
//   try {
//     // throw new Error("This function is not implemented yet");
//     const user = await requireAdmin();

//     const title = formData.get("title") as string;
//     const description = formData.get("description") as string;
//     const longDescription = formData.get("longDescription") as string;
//     const category = formData.get("category") as string;
//     const tool = formData.get("tool") as string;
//     const hasGuide = formData.get("hasGuide") === "on";
//     const guideUrl = formData.get("guideUrl") as string;
//     const featured = formData.get("featured") === "on";
//     const published = formData.get("published") === "on";

//     // Handle file uploads
//     const thumbnailFile = formData.get("thumbnail") as File;
//     const resourceFile = formData.get("resourceFile") as File;

//     let thumbnailPath = null;
//     let filePath = null;

//     // Upload thumbnail
//     if (thumbnailFile && thumbnailFile.size > 0) {
//       thumbnailPath = await uploadFile(thumbnailFile, "thumbnails", "thumb");
//     }

//     // Upload resource file
//     if (resourceFile && resourceFile.size > 0) {
//       const resourceDir = join(process.cwd(), "public", "uploads", "resources");
//       await mkdir(resourceDir, { recursive: true });

//       const resourceExt = resourceFile.name.split(".").pop();
//       const resourceName = `${title} TEMPLATE.${resourceExt}`;
//       const resourceFullPath = join(resourceDir, resourceName);

//       const resourceBuffer = Buffer.from(await resourceFile.arrayBuffer());
//       await writeFile(resourceFullPath, resourceBuffer);

//       filePath = `/uploads/resources/${resourceName}`;
//     }

//     // Generate slug
//     const slug = title
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/(^-|-$)/g, "");

//     // Create resource
//     const resource = await prisma.resource.create({
//       data: {
//         title,
//         slug,
//         description,
//         longDescription: longDescription || null,
//         category: category as ResourceCategory,
//         tool: tool || null,
//         hasGuide,
//         guideUrl: guideUrl || null,
//         featured,
//         published,
//         thumbnail: thumbnailPath,
//         filePath,
//         fileType: resourceFile?.type || null,
//         authorId: user.id,
//       },
//     });

//     revalidatePath("/admin/resources");
//     revalidatePath("/resources");
//     revalidatePath("/");

//     return { success: true, resourceId: resource.id };
//   } catch (error) {
//     console.error("Failed to create resource:", error);
//     return {
//       success: false,
//       error: `"Failed to create resource. Please try again."${error}`,
//     };
//   }
// }
export async function createResource(prevState: any, formData: FormData) {
  try {
    const user = await getCurrentUser();
    await requireAdmin();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const longDescription = formData.get("longDescription") as string;
    const category = formData.get("category") as string;
    const tool = formData.get("tool") as string;
    const hasGuide = formData.get("hasGuide") === "on";
    const guideUrl = formData.get("guideUrl") as string;
    const featured = formData.get("featured") === "on";
    const published = formData.get("published") === "on";

    const thumbnailFile = formData.get("thumbnail") as File;
    const resourceFile = formData.get("resourceFile") as File;

    let thumbnailPath = null;
    let filePath = null;
    let fileType = null;

    // Upload thumbnail
    if (thumbnailFile && thumbnailFile.size > 0) {
      thumbnailPath = await uploadFile(
        thumbnailFile,
        "thumbnails",
        `thumb-${Date.now()}`
      );
    }

    // Upload resource file
    if (resourceFile && resourceFile.size > 0) {
      filePath = await uploadFile(
        resourceFile,
        "resources",
        `res-${Date.now()}`
      );
      fileType = resourceFile.type;
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Save in DB
    const resource = await prisma.resource.create({
      data: {
        title,
        slug,
        description,
        longDescription: longDescription || null,
        category: category as ResourceCategory,
        tool: tool || null,
        hasGuide,
        guideUrl: guideUrl || null,
        featured,
        published,
        thumbnail: thumbnailPath,
        filePath,
        fileType,
        authorId: user?.id,
      },
    });

    revalidatePath("/admin/resources");
    revalidatePath("/resources");
    revalidatePath("/");

    return { success: true, resourceId: resource.id };
  } catch (error) {
    console.error("Failed to create resource:", error);
    return {
      success: false,
      error: `Failed to create resource. Please try again. ${error}`,
    };
  }
}

// Admin: Update resource
export async function updateResource(
  resourceId: string,
  prevState: any,
  formData: FormData
) {
  try {
    await requireAdmin();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const longDescription = formData.get("longDescription") as string;
    const category = formData.get("category") as string;
    const tool = formData.get("tool") as string;
    const hasGuide = formData.get("hasGuide") === "on";
    const guideUrl = formData.get("guideUrl") as string;
    const featured = formData.get("featured") === "on";
    const published = formData.get("published") === "on";

    const thumbnailFile = formData.get("thumbnail") as File;
    const resourceFile = formData.get("resourceFile") as File;

    // Fetch current resource to delete old files
    const currentResource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!currentResource) throw new Error("Resource not found");

    const updateData: any = {
      title,
      description,
      longDescription: longDescription || null,
      category: category as any,
      tool: tool || null,
      hasGuide,
      guideUrl: guideUrl || null,
      featured,
      published,
    };

    // Handle thumbnail update
    if (thumbnailFile && thumbnailFile.size > 0) {
      if (currentResource.thumbnail) {
        await deleteFile(currentResource.thumbnail);
      }
      const thumbnailPath = await uploadFile(
        thumbnailFile,
        "thumbnails",
        `thumb-${Date.now()}`
      );
      updateData.thumbnail = thumbnailPath;
    }

    // Handle resource file update
    if (resourceFile && resourceFile.size > 0) {
      if (currentResource.filePath) {
        await deleteFile(currentResource.filePath);
      }
      const resourcePath = await uploadFile(
        resourceFile,
        "resources",
        `res-${Date.now()}`
      );
      updateData.filePath = resourcePath;
      updateData.fileType = resourceFile.type;
    }

    // Update slug if title changed
    updateData.slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await prisma.resource.update({
      where: { id: resourceId },
      data: updateData,
    });

    revalidatePath("/admin/resources");
    revalidatePath("/resources");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to update resource:", error);
    return {
      success: false,
      error: "Failed to update resource. Please try again.",
    };
  }
}

// Admin: Delete resource
export async function deleteResource(resourceId: string) {
  try {
    await requireAdmin();

    await prisma.resource.delete({
      where: { id: resourceId },
    });

    revalidatePath("/admin/resources");
    revalidatePath("/resources");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete resource:", error);
    return {
      success: false,
      error: "Failed to delete resource. Please try again.",
    };
  }
}

// Admin: Toggle resource status
export async function toggleResourceStatus(
  resourceId: string,
  field: "published" | "featured"
) {
  try {
    await requireAdmin();

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { [field]: true },
    });

    if (!resource) {
      return { success: false, error: "Resource not found" };
    }

    await prisma.resource.update({
      where: { id: resourceId },
      data: {
        [field]: !resource[field],
      },
    });

    revalidatePath("/admin/resources");
    revalidatePath("/resources");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to toggle resource status:", error);
    return {
      success: false,
      error: "Failed to update resource status.",
    };
  }
}

// Handles deleting files both in local /public/uploads and Supabase
async function deleteFile(filePath: string) {
  try {
    if (!filePath) return;

    // Case 1: Local file in public/uploads
    if (filePath.startsWith("/uploads/")) {
      const fullPath = join(process.cwd(), "public", filePath);
      await unlink(fullPath).catch(() => {}); // ignore if missing
      return;
    }

    // Case 2: Supabase public URL
    const url = new URL(filePath);
    const parts = url.pathname.split("/");
    const bucket = parts[2]; // after /storage/v1/object/public/<bucket>/
    const fileName = parts.slice(3).join("/");

    const { error } = await supabase.storage.from(bucket).remove([fileName]);
    if (error) throw error;
  } catch (err) {
    console.error("Failed to delete file:", err);
  }
}
