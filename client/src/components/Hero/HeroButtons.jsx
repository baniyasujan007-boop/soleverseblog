import Button from "../Common/Button/Button.jsx";

function HeroButtons() {
  return (
    <div className="flex gap-4 mt-8">
      <Button>Explore Now</Button>

      <Button variant="secondary">
        Release Info
      </Button>
    </div>
  );
}

export default HeroButtons;