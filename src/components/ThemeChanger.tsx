const ThemeChanger = () => {
  return (
    <div className="join join-vertical">
      <input
        type="radio"
        name="theme-buttons"
        className="btn theme-controller join-item"
        aria-label="Winter"
        value="winter"
      />
      <input
        type="radio"
        name="theme-buttons"
        className="btn theme-controller join-item"
        aria-label="Retro"
        value="retro"
      />
      <input
        type="radio"
        name="theme-buttons"
        className="btn theme-controller join-item"
        aria-label="Dark"
        value="dark"
      />
      <input
        type="radio"
        name="theme-buttons"
        className="btn theme-controller join-item"
        aria-label="Garden"
        value="garden"
      />
      <input
        type="radio"
        name="theme-buttons"
        className="btn theme-controller join-item"
        aria-label="Nord"
        value="nord"
      />
    </div>
  );
};

export default ThemeChanger;
