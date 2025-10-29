
-- Create site_settings table for dynamic configuration
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_name TEXT NOT NULL DEFAULT 'OnAssist',
  brand_email TEXT NOT NULL DEFAULT 'support@onassist.com',
  brand_phone TEXT NOT NULL DEFAULT '+1 (888) 970-1698',
  openrouter_api_key TEXT,
  pexels_api_key TEXT,
  head_scripts TEXT DEFAULT '',
  body_scripts TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.site_settings (
  brand_name, 
  brand_email, 
  brand_phone, 
  openrouter_api_key, 
  pexels_api_key,
  head_scripts,
  body_scripts
) VALUES (
  'OnAssist',
  'support@onassist.com',
  '+1 (888) 970-1698',
  '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',
  '88Qykg1vwK4s2Q73EgXOvKaSxAH5VUHKMVGC2NBt1TXD2sJp0hnnsKia',
  '<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-16696189784"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag("js", new Date());
  gtag("config", "AW-16696189784");
</script>',
  '<!-- Default Statcounter code -->
<script type="text/javascript">
var sc_project=13146474; 
var sc_invisible=1; 
var sc_security="3fffbe23"; 
</script>
<script type="text/javascript"
src="https://www.statcounter.com/counter/counter.js" async></script>'
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage site settings
CREATE POLICY "Only admins can manage site settings" ON public.site_settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Anyone can view site settings (for displaying brand info)
CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);
