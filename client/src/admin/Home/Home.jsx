import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import api from "../../api/axios";
import { useToast } from "../components/Toast";

const defaults = [
  "hero",
  "latestNews",
  "latestReleases",
  "topBrands",
  "newsletter",
  "trending",
].map((id, order) => ({
  id,
  enabled: true,
  order,
  limit: id === "latestNews" ? 4 : id === "trending" ? 5 : 6,
  desktopVisible: true,
  tabletVisible: true,
  mobileVisible: true,
}));
const names = {
  hero: "Hero slider",
  latestNews: "Latest news",
  latestReleases: "Latest releases",
  topBrands: "Top brands",
  newsletter: "Newsletter",
  trending: "Trending",
};
const pageTitles = {
  hero: "Hero Section",
  news: "Featured News",
  releases: "Featured Releases",
  brands: "Brands Section",
  newsletter: "Newsletter Section",
  trending: "Trending Section",
  seo: "Homepage SEO",
};

function Field({ label, children, wide = false }) {
  return (
    <label
      className={`block text-xs font-bold text-slate-600 ${wide ? "md:col-span-2" : ""}`}
    >
      <span>{label}</span>
      {children}
    </label>
  );
}
function Input({ value, onChange, type = "text", ...props }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(event) =>
        onChange(
          type === "number" ? Number(event.target.value) : event.target.value,
        )
      }
      className="field bg-white text-sm font-normal text-slate-900"
      {...props}
    />
  );
}
function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
      <input
        type="checkbox"
        checked={checked ?? true}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}
function Accordion({ title, open, onToggle, children }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50"
      >
        <span className="text-sm font-black text-slate-900">{title}</span>
        <FiChevronDown
          className={`text-lg text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 px-5 py-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default function Home({ activeSection = null }) {
  const [form, setForm] = useState(null);
  const [openState, setOpenState] = useState(() => ({
    activeSection,
    value: activeSection || "general",
  }));
  const toast = useToast();
  if (openState.activeSection !== activeSection) {
    setOpenState({ activeSection, value: activeSection || "general" });
  }
  useEffect(() => {
    api
      .get("/cms/settings")
      .then(({ data }) => setForm(data.data))
      .catch(() => toast("Could not load homepage settings", "error"));
  }, [toast]);
  if (!form)
    return (
      <div className="py-16 text-center text-slate-500">
        Loading homepage settings…
      </div>
    );
  const home = form.homepage || {};
  const sections = home.sections?.length ? home.sections : defaults;
  const setHome = (key, value) =>
    setForm((current) => ({
      ...current,
      homepage: { ...current.homepage, [key]: value },
    }));
  const patch = (key, value) => setHome(key, { ...home[key], ...value });
  const sectionFor = (id) =>
    sections.find((item) => item.id === id) ||
    defaults.find((item) => item.id === id) || { id, enabled: true };
  const patchSection = (id, value) => {
    const index = sections.findIndex((item) => item.id === id);
    const next = [...sections];
    if (index === -1) next.push({ ...sectionFor(id), ...value });
    else next[index] = { ...next[index], ...value };
    setHome("sections", next);
  };
  const save = async (event) => {
    event.preventDefault();
    try {
      await api.put("/cms/settings", {
        siteName: form.siteName || "SoleVerse",
        footerText: form.footerText || "",
        seo: form.seo || {},
        social: form.social || {},
        homepage: { ...home, sections },
      });
      toast("Homepage settings saved");
    } catch (error) {
      toast(
        error.response?.data?.message || "Could not save homepage",
        "error",
      );
    }
  };
  const sectionFields = (id, extra = null) => {
    const section = sectionFor(id);
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Toggle
          checked={section.enabled}
          onChange={(enabled) => patchSection(id, { enabled })}
          label="Show this section"
        />
        <Field label="Maximum items">
          <Input
            type="number"
            min="1"
            value={section.limit || 6}
            onChange={(limit) => patchSection(id, { limit })}
          />
        </Field>
        <Field label="Section title">
          <Input
            value={section.title || ""}
            onChange={(title) => patchSection(id, { title })}
          />
        </Field>
        <Field label="Button text">
          <Input
            value={section.buttonText || ""}
            onChange={(buttonText) => patchSection(id, { buttonText })}
          />
        </Field>
        <Field label="Button URL" wide>
          <Input
            value={section.buttonUrl || ""}
            onChange={(buttonUrl) => patchSection(id, { buttonUrl })}
          />
        </Field>
        {extra}
      </div>
    );
  };
  const panel = (id, title, content) => {
    if (activeSection && activeSection !== id) return null;
    return (
    <Accordion
      title={title}
      open={openState.value === id}
      onToggle={() =>
        setOpenState((current) => ({
          ...current,
          value: current.value === id ? null : id,
        }))
      }
    >
      {content}
    </Accordion>
    );
  };
  return (
    <form onSubmit={save} className="max-w-5xl space-y-3 pb-12">
      <header className="mb-6">
        <h2 className="text-2xl font-black">{pageTitles[activeSection] || "Homepage CMS"}</h2>
        <p className="mt-1 text-sm text-slate-400">
          {activeSection
            ? "Manage this homepage section using the existing CMS settings."
            : "Manage your homepage content, appearance, and layout from one place."}
        </p>
      </header>
      {panel(
        "general",
        "General",
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Website name">
            <Input
              value={form.siteName || "SoleVerse"}
              onChange={(siteName) =>
                setForm((current) => ({ ...current, siteName }))
              }
            />
          </Field>
          <Field label="Footer text">
            <Input
              value={form.footerText || ""}
              onChange={(footerText) =>
                setForm((current) => ({ ...current, footerText }))
              }
            />
          </Field>
          <Field label="Instagram">
            <Input
              value={form.social?.instagram || ""}
              onChange={(instagram) =>
                setForm((current) => ({
                  ...current,
                  social: { ...current.social, instagram },
                }))
              }
            />
          </Field>
          <Field label="X / Twitter">
            <Input
              value={form.social?.twitter || ""}
              onChange={(twitter) =>
                setForm((current) => ({
                  ...current,
                  social: { ...current.social, twitter },
                }))
              }
            />
          </Field>
        </div>,
      )}
      {panel(
        "breaking",
        "Breaking Bar",
        <div className="grid gap-4 md:grid-cols-2">
          <Toggle
            checked={home.breakingNews?.enabled}
            onChange={(enabled) => patch("breakingNews", { enabled })}
            label="Enable breaking bar"
          />
          <Field label="Animation">
            <select
              className="field bg-white text-sm font-normal text-slate-900"
              value={home.breakingNews?.animation || "ticker"}
              onChange={(event) =>
                patch("breakingNews", { animation: event.target.value })
              }
            >
              <option value="ticker">Scrolling ticker</option>
              <option value="static">Static</option>
            </select>
          </Field>
          <Field label="Headline" wide>
            <Input
              value={
                home.breakingNews?.headline || home.breakingNews?.text || ""
              }
              onChange={(headline) =>
                patch("breakingNews", { headline, text: headline })
              }
            />
          </Field>
          <Field label="Badge">
            <Input
              value={home.breakingNews?.badge || "NEW"}
              onChange={(badge) => patch("breakingNews", { badge })}
            />
          </Field>
          <Field label="Link">
            <Input
              value={home.breakingNews?.link || ""}
              onChange={(link) => patch("breakingNews", { link })}
            />
          </Field>
          <Field label="Background colour">
            <Input
              type="color"
              value={home.breakingNews?.backgroundColor || "#050505"}
              onChange={(backgroundColor) =>
                patch("breakingNews", { backgroundColor })
              }
            />
          </Field>
          <Field label="Text colour">
            <Input
              type="color"
              value={home.breakingNews?.textColor || "#ffffff"}
              onChange={(textColor) => patch("breakingNews", { textColor })}
            />
          </Field>
          <Field label="Speed (seconds)">
            <Input
              type="number"
              min="8"
              value={home.breakingNews?.speed || 28}
              onChange={(speed) => patch("breakingNews", { speed })}
            />
          </Field>
        </div>,
      )}
      {panel(
        "header",
        "Header",
        <div className="grid gap-4 md:grid-cols-2">
          <Toggle
            checked={home.navigation?.sticky}
            onChange={(sticky) => patch("navigation", { sticky })}
            label="Sticky navigation"
          />
          <Toggle
            checked={home.navigation?.transparent ?? false}
            onChange={(transparent) => patch("navigation", { transparent })}
            label="Transparent over hero"
          />
          <Field label="Background colour">
            <Input
              type="color"
              value={home.navigation?.backgroundColor || "#050505"}
              onChange={(backgroundColor) =>
                patch("navigation", { backgroundColor })
              }
            />
          </Field>
          <Field label="Text colour">
            <Input
              type="color"
              value={home.navigation?.textColor || "#ffffff"}
              onChange={(textColor) => patch("navigation", { textColor })}
            />
          </Field>
          <p className="text-xs leading-5 text-slate-500 md:col-span-2">
            Navigation menu items and the logo remain managed in the existing
            Settings and navigation CMS fields.
          </p>
        </div>,
      )}
      {panel(
        "hero",
        "Hero",
        <div className="grid gap-4 md:grid-cols-2">
          <Toggle
            checked={home.hero?.autoPlay}
            onChange={(autoPlay) => patch("hero", { autoPlay })}
            label="Auto-play slides"
          />
          <Field label="Slider speed (milliseconds)">
            <Input
              type="number"
              min="1000"
              value={home.hero?.sliderSpeed || 6000}
              onChange={(sliderSpeed) => patch("hero", { sliderSpeed })}
            />
          </Field>
          <Field label="Background image URL" wide>
            <Input
              value={home.hero?.backgroundImage || ""}
              onChange={(backgroundImage) => patch("hero", { backgroundImage })}
            />
          </Field>
          <Field label="Overlay colour">
            <Input
              type="color"
              value={home.hero?.overlayColor || "#050505"}
              onChange={(overlayColor) => patch("hero", { overlayColor })}
            />
          </Field>
          <Field label="Overlay opacity">
            <Input
              type="number"
              min="0"
              max="100"
              value={home.hero?.overlayOpacity ?? 55}
              onChange={(overlayOpacity) => patch("hero", { overlayOpacity })}
            />
          </Field>
          <Field label="Text alignment">
            <select
              className="field bg-white text-sm font-normal text-slate-900"
              value={home.hero?.textAlign || "left"}
              onChange={(event) =>
                patch("hero", { textAlign: event.target.value })
              }
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
            </select>
          </Field>
          <Field label="Animation">
            <select
              className="field bg-white text-sm font-normal text-slate-900"
              value={home.hero?.animation || "fade"}
              onChange={(event) =>
                patch("hero", { animation: event.target.value })
              }
            >
              <option value="fade">Fade</option>
              <option value="slide">Slide</option>
            </select>
          </Field>
          <p className="text-xs leading-5 text-slate-500 md:col-span-2">
            Create and reorder slide content in the existing Hero Slides CMS.
          </p>
        </div>,
      )}
      {panel(
        "news",
        "Latest News",
        sectionFields(
          "latestNews",
          <p className="text-xs text-slate-500 md:col-span-2">
            Articles are automatically sourced from published content.
          </p>,
        ),
      )}
      {panel(
        "releases",
        "Latest Releases",
        sectionFields(
          "latestReleases",
          <p className="text-xs text-slate-500 md:col-span-2">
            Release prices, dates, and imagery are managed in Releases.
          </p>,
        ),
      )}
      {panel(
        "brands",
        "Top Brands",
        sectionFields(
          "topBrands",
          <p className="text-xs text-slate-500 md:col-span-2">
            Brand logos and display order are managed in Brands.
          </p>,
        ),
      )}
      {panel(
        "newsletter",
        "Newsletter",
        <div className="grid gap-4 md:grid-cols-2">
          <Toggle
            checked={home.newsletter?.enabled}
            onChange={(enabled) => patch("newsletter", { enabled })}
            label="Show newsletter"
          />
          <Field label="Button text">
            <Input
              value={home.newsletter?.buttonText || "Subscribe"}
              onChange={(buttonText) => patch("newsletter", { buttonText })}
            />
          </Field>
          <Field label="Headline">
            <Input
              value={home.newsletter?.title || ""}
              onChange={(title) => patch("newsletter", { title })}
            />
          </Field>
          <Field label="Email placeholder">
            <Input
              value={home.newsletter?.placeholder || "Enter your email address"}
              onChange={(placeholder) => patch("newsletter", { placeholder })}
            />
          </Field>
          <Field label="Description" wide>
            <Input
              value={home.newsletter?.subtitle || ""}
              onChange={(subtitle) => patch("newsletter", { subtitle })}
            />
          </Field>
          <Field label="Background colour">
            <Input
              type="color"
              value={home.newsletter?.backgroundColor || "#080808"}
              onChange={(backgroundColor) =>
                patch("newsletter", { backgroundColor })
              }
            />
          </Field>
          <Field label="Button colour">
            <Input
              type="color"
              value={home.newsletter?.buttonColor || "#eee0c9"}
              onChange={(buttonColor) => patch("newsletter", { buttonColor })}
            />
          </Field>
          <Field label="Background image URL" wide>
            <Input
              value={home.newsletter?.backgroundImage || ""}
              onChange={(backgroundImage) =>
                patch("newsletter", { backgroundImage })
              }
            />
          </Field>
          <Field label="Success message" wide>
            <Input
              value={home.newsletter?.successMessage || "You’re on the list."}
              onChange={(successMessage) =>
                patch("newsletter", { successMessage })
              }
            />
          </Field>
        </div>,
      )}
      {panel(
        "trending",
        "Trending",
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Selection">
            <select
              className="field bg-white text-sm font-normal text-slate-900"
              value={home.trending?.mode || "views"}
              onChange={(event) =>
                patch("trending", { mode: event.target.value })
              }
            >
              <option value="views">Automatic by views</option>
              <option value="manual">Manual article IDs</option>
            </select>
          </Field>
          <Field label="Status label">
            <Input
              value={home.trending?.statusLabel || "Trending"}
              onChange={(statusLabel) => patch("trending", { statusLabel })}
            />
          </Field>
          {sectionFields("trending")}
        </div>,
      )}
      {panel(
        "layout",
        "Layout Builder",
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Set order, spacing, visibility, background, and custom classes per
            section.
          </p>
          {[...sections]
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <div
                key={section.id}
                className="grid gap-3 rounded-lg border border-slate-200 p-3 md:grid-cols-4"
              >
                <b className="self-center text-sm text-slate-800">
                  {names[section.id] || section.id}
                </b>
                <Field label="Order">
                  <Input
                    type="number"
                    value={section.order}
                    onChange={(order) => patchSection(section.id, { order })}
                  />
                </Field>
                <Field label="Padding">
                  <Input
                    value={section.padding || ""}
                    placeholder="2rem 0"
                    onChange={(padding) =>
                      patchSection(section.id, { padding })
                    }
                  />
                </Field>
                <Field label="Background">
                  <Input
                    type="color"
                    value={section.backgroundColor || "#ffffff"}
                    onChange={(backgroundColor) =>
                      patchSection(section.id, { backgroundColor })
                    }
                  />
                </Field>
              </div>
            ))}
        </div>,
      )}
      {panel(
        "theme",
        "Theme",
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Hero primary CTA">
            <Input
              type="color"
              value={home.hero?.primaryCtaColor || "#eee0c9"}
              onChange={(primaryCtaColor) => patch("hero", { primaryCtaColor })}
            />
          </Field>
          <Field label="Hero secondary CTA">
            <Input
              type="color"
              value={home.hero?.secondaryCtaColor || "#ffffff"}
              onChange={(secondaryCtaColor) =>
                patch("hero", { secondaryCtaColor })
              }
            />
          </Field>
          <p className="text-xs text-slate-500 md:col-span-2">
            Section backgrounds can be managed in Layout Builder.
          </p>
        </div>,
      )}
      {panel(
        "seo",
        "SEO",
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Homepage title">
            <Input
              value={form.seo?.title || ""}
              onChange={(title) =>
                setForm((current) => ({
                  ...current,
                  seo: { ...current.seo, title },
                }))
              }
            />
          </Field>
          <Field label="Keywords">
            <Input
              value={form.seo?.keywords || ""}
              onChange={(keywords) =>
                setForm((current) => ({
                  ...current,
                  seo: { ...current.seo, keywords },
                }))
              }
            />
          </Field>
          <Field label="Meta description" wide>
            <textarea
              value={form.seo?.description || ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  seo: { ...current.seo, description: event.target.value },
                }))
              }
              className="field min-h-24 bg-white text-sm font-normal text-slate-900"
            />
          </Field>
        </div>,
      )}
      {panel(
        "advanced",
        "Advanced",
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Advanced display controls are applied to each section without
            affecting its content source.
          </p>
          {sections.map((section) => (
            <div
              key={section.id}
              className="grid gap-3 rounded-lg border border-slate-200 p-3 md:grid-cols-4"
            >
              <b className="self-center text-sm text-slate-800">
                {names[section.id] || section.id}
              </b>
              <Field label="Custom CSS class">
                <Input
                  value={section.customClass || ""}
                  onChange={(customClass) =>
                    patchSection(section.id, { customClass })
                  }
                />
              </Field>
              {[
                ["Desktop", "desktopVisible"],
                ["Tablet", "tabletVisible"],
                ["Mobile", "mobileVisible"],
              ].map(([label, key]) => (
                <Toggle
                  key={key}
                  checked={section[key]}
                  onChange={(value) =>
                    patchSection(section.id, { [key]: value })
                  }
                  label={label}
                />
              ))}
            </div>
          ))}
        </div>,
      )}
      <div className="sticky bottom-4 flex justify-end pt-3">
        <button className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700">
          Save homepage settings
        </button>
      </div>
    </form>
  );
}
