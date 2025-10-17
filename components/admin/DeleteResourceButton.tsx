"use client";
import { deleteResource } from "@/app/actions/resources";
import React from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

const DeleteResourceButton = ({ resourceId }: { resourceId: string }) => {
  return (
    <form
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete this resource?")) {
          e.preventDefault(); // stop form from submitting
        }
      }}
      action={deleteResource.bind(null, resourceId)}
    >
      <Button
        type="submit"
        size="sm"
        variant="ghost"
        className="text-red-400 hover:text-red-300"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default DeleteResourceButton;
