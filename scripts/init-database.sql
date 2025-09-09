-- Initialize database tables
-- This script will be run after prisma generate and prisma db push

-- Create initial admin user (will be handled by Clerk)
-- Create sample data if needed

-- Sample resource categories
INSERT IGNORE INTO site_settings (id, `key`, value, type) VALUES 
('setting_1', 'site_name', 'Blazing Automations', 'string'),
('setting_2', 'site_description', 'Premium automation templates and resources', 'string'),
('setting_3', 'contact_email', 'hello@blazingautomations.com', 'string');

-- Sample site content
INSERT IGNORE INTO site_content (id, `key`, title, content) VALUES 
('content_1', 'hero_title', 'Hero Title', 'Transform Your Business with Blazing Fast Automations'),
('content_2', 'hero_subtitle', 'Hero Subtitle', 'Get premium Make.com, Zapier, and n8n templates that save you hours of setup time'),
('content_3', 'about_content', 'About Us', 'We specialize in creating high-quality automation templates and resources.');
