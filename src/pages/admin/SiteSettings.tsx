import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { updateSiteSettings } from "@/services/supabaseService";
import { Save, Globe, Code, Key, Phone, Mail, Eye, EyeOff } from "lucide-react";

export default function SiteSettings() {
  const { settings, refreshSettings, isLoading } = useSiteSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [showOpenRouterKey, setShowOpenRouterKey] = useState(false);
  const [showPexelsKey, setShowPexelsKey] = useState(false);
  const [formData, setFormData] = useState({
    brand_name: "",
    brand_email: "",
    brand_phone: "",
    openrouter_api_key: "",
    pexels_api_key: "",
    head_scripts: "",
    body_scripts: "",
  });

  // Update form when settings load
  React.useEffect(() => {
    if (settings) {
      setFormData({
        brand_name: settings.brand_name || "",
        brand_email: settings.brand_email || "",
        brand_phone: settings.brand_phone || "",
        openrouter_api_key: settings.openrouter_api_key || "",
        pexels_api_key: settings.pexels_api_key || "",
        head_scripts: settings.head_scripts || "",
        body_scripts: settings.body_scripts || "",
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      console.log("Updating settings with:", formData);
      await updateSiteSettings(formData);
      console.log("Settings updated successfully");

      // Refresh settings context to get latest data
      await refreshSettings();

      toast({
        title: "Settings Updated Successfully!",
        description:
          "Site settings have been updated and changes will be reflected across the website.",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Update Failed",
        description: `Failed to update site settings: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Globe className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Brand Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="brand_name">Brand Name</Label>
              <Input
                id="brand_name"
                value={formData.brand_name}
                onChange={(e) =>
                  setFormData({ ...formData, brand_name: e.target.value })
                }
                placeholder="Enter your brand name"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                This will appear in the website title and header
              </p>
            </div>

            <div>
              <Label
                htmlFor="brand_email"
                className="flex items-center space-x-1"
              >
                <Mail className="h-4 w-4" />
                <span>Brand Email</span>
              </Label>
              <Input
                id="brand_email"
                type="email"
                value={formData.brand_email}
                onChange={(e) =>
                  setFormData({ ...formData, brand_email: e.target.value })
                }
                placeholder="support@yourbrand.com"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Contact email displayed in footer
              </p>
            </div>

            <div>
              <Label
                htmlFor="brand_phone"
                className="flex items-center space-x-1"
              >
                <Phone className="h-4 w-4" />
                <span>Brand Phone</span>
              </Label>
              <Input
                id="brand_phone"
                value={formData.brand_phone}
                onChange={(e) =>
                  setFormData({ ...formData, brand_phone: e.target.value })
                }
                placeholder="+1 (888) 970-1698"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Contact phone displayed in footer
              </p>
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>API Keys</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="openrouter_api_key">OpenRouter API Key</Label>
              <div className="relative">
                <Input
                  id="openrouter_api_key"
                  type={showOpenRouterKey ? "text" : "password"}
                  value={formData.openrouter_api_key}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      openrouter_api_key: e.target.value,
                    })
                  }
                  placeholder="sk-or-v1-..."
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenRouterKey(!showOpenRouterKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showOpenRouterKey ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Used for AI content generation
              </p>
            </div>

            <div>
              <Label htmlFor="pexels_api_key">Pexels API Key</Label>
              <div className="relative">
                <Input
                  id="pexels_api_key"
                  type={showPexelsKey ? "text" : "password"}
                  value={formData.pexels_api_key}
                  onChange={(e) =>
                    setFormData({ ...formData, pexels_api_key: e.target.value })
                  }
                  placeholder="Your Pexels API key"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPexelsKey(!showPexelsKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPexelsKey ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Used for generating blog images
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Custom Scripts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>Custom Scripts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="head_scripts">
                Scripts for &lt;head&gt; section
              </Label>
              <Textarea
                id="head_scripts"
                value={formData.head_scripts}
                onChange={(e) =>
                  setFormData({ ...formData, head_scripts: e.target.value })
                }
                placeholder="<!-- Insert scripts that should go in the head section -->"
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-1">
                You can enter either a &lt;script&gt; tag (recommended) or plain
                JavaScript code. If you enter plain code, it will be wrapped in
                a &lt;script&gt; tag automatically.
                <br />
                <b>Example:</b>{" "}
                <code>&lt;script&gt;console.log('Hello')&lt;/script&gt;</code>{" "}
                or <code>console.log('Hello')</code>
              </p>
            </div>

            <div>
              <Label htmlFor="body_scripts">
                Scripts for &lt;body&gt; section
              </Label>
              <Textarea
                id="body_scripts"
                value={formData.body_scripts}
                onChange={(e) =>
                  setFormData({ ...formData, body_scripts: e.target.value })
                }
                placeholder="<!-- Insert scripts that should go in the body section -->"
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-1">
                You can enter either a &lt;script&gt; tag (recommended) or plain
                JavaScript code. If you enter plain code, it will be wrapped in
                a &lt;script&gt; tag automatically.
                <br />
                <b>Example:</b>{" "}
                <code>&lt;script&gt;console.log('Hello')&lt;/script&gt;</code>{" "}
                or <code>console.log('Hello')</code>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving Changes..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
