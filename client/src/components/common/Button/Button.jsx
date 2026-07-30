function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
}) {
  const base =
    "px-6 py-3 rounded-lg font-semibold transition duration-300";

  const styles = {
    primary: "bg-black text-white hover:bg-red-600",
    secondary: "border border-black hover:bg-black hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;