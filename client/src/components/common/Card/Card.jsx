function Card({ children, className = "" }) {
  return (
    <article
      className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 ${className}`}
    >
      {children}
    </article>
  );
}

export default Card;