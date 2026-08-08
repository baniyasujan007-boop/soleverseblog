import SectionTitle from "../SectionTitle/SectionTitle";

function EditorialSection({
  title,
  kicker,
  action,
  to,
  tone = "transparent",
  size = "default",
  rule = true,
  className = "",
  contentClassName = "",
  children,
}) {
  const toneClasses = {
    transparent: "",
    cream: "bg-[#f7f7f5]",
    white: "bg-white",
    dark: "bg-[#050505] text-white",
  }[tone];

  const sizeClasses = size === "tight" ? "py-8 sm:py-10" : "py-10 sm:py-14";
  const hasHeader = Boolean(title || kicker);

  return (
    <section className={`w-full ${toneClasses}`}>
      <div className={`mx-auto max-w-[1600px] px-5 sm:px-10 ${sizeClasses} ${className}`}>
        {hasHeader && (
          <SectionTitle
            variant="editorial"
            tone={tone}
            title={title}
            kicker={kicker}
            action={action}
            to={to}
            rule={rule}
          />
        )}
        <div className={`${hasHeader ? "mt-8" : ""} ${contentClassName}`}>{children}</div>
      </div>
    </section>
  );
}

export default EditorialSection;
