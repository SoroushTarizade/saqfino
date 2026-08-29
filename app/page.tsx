const primaryColors = [
  ["Primary", "var(--color-primary)"],
  ["Shade 1", "var(--color-primary-shade-1)"],
  ["Shade 2", "var(--color-primary-shade-2)"],
  ["Shade 3", "var(--color-primary-shade-3)"],
  ["Shade 4", "var(--color-primary-shade-4)"],
  ["Shade 5", "var(--color-primary-shade-5)"],
  ["Shade 6", "var(--color-primary-shade-6)"],
  ["Tint 1", "var(--color-primary-tint-1)"],
  ["Tint 2", "var(--color-primary-tint-2)"],
  ["Tint 3", "var(--color-primary-tint-3)"],
  ["Tint 4", "var(--color-primary-tint-4)"],
  ["Tint 5", "var(--color-primary-tint-5)"],
  ["Tint 6", "var(--color-primary-tint-6)"],
  ["Tint 7", "var(--color-primary-tint-7)"],
];

const neutralColors = [
  ["White", "var(--color-white)"],
  ["Gray 2", "var(--color-gray-2)"],
  ["Gray 3", "var(--color-gray-3)"],
  ["Gray 4", "var(--color-gray-4)"],
  ["Gray 5", "var(--color-gray-5)"],
  ["Gray 6", "var(--color-gray-6)"],
  ["Gray 7", "var(--color-gray-7)"],
  ["Gray 8", "var(--color-gray-8)"],
  ["Gray 9", "var(--color-gray-9)"],
  ["Gray 10", "var(--color-gray-10)"],
  ["Gray 11", "var(--color-gray-11)"],
  ["Gray 12", "var(--color-gray-12)"],
  ["Gray 13", "var(--color-gray-13)"],
  ["Black", "var(--color-black)"],
];

const stateColors = [
  ["Error", "var(--color-error)"],
  ["Error Light 1", "var(--color-error-light-1)"],
  ["Error Light 2", "var(--color-error-light-2)"],
  ["Success", "var(--color-success)"],
  ["Success Light 1", "var(--color-success-light-1)"],
  ["Success Light 2", "var(--color-success-light-2)"],
  ["Warning", "var(--color-warning)"],
  ["Warning Light 1", "var(--color-warning-light-1)"],
  ["Warning Light 2", "var(--color-warning-light-2)"],
];

function ColorGrid({
  colors,
}: {
  colors: string[][];
}) {
  return (
    <div className="color-grid">
      {colors.map(([name, value]) => (
        <div className="color-item" key={name}>
          <div
            className="color-swatch"
            style={{ backgroundColor: value }}
          />
          <div className="color-info">
            <strong>{name}</strong>
            <span>{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="playground">
      <header className="playground-header">
        <span className="eyebrow">Saqfino Design System</span>
        <h1>سقفینو</h1>
        <p>
          صفحه تست اولیه Design System پروژه سقفینو
        </p>
      </header>

      <section className="section">
        <h2>Typography</h2>

        <div className="type-list">
          <div className="type-row">
            <span>Light — 300</span>
            <p className="font-light">خانه‌ای برای زندگی بهتر</p>
          </div>

          <div className="type-row">
            <span>Regular — 400</span>
            <p className="font-regular">خانه‌ای برای زندگی بهتر</p>
          </div>

          <div className="type-row">
            <span>Bold — 700</span>
            <p className="font-bold">خانه‌ای برای زندگی بهتر</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Primary Colors</h2>
        <ColorGrid colors={primaryColors} />
      </section>

      <section className="section">
        <h2>Neutral Colors</h2>
        <ColorGrid colors={neutralColors} />
      </section>

      <section className="section">
        <h2>State Colors</h2>
        <ColorGrid colors={stateColors} />
      </section>

      <section className="section">
        <h2>Border Radius</h2>

        <div className="radius-grid">
          <div className="radius-box radius-sm">
            <span>8px</span>
          </div>

          <div className="radius-box radius-md">
            <span>12px</span>
          </div>

          <div className="radius-box radius-lg">
            <span>16px</span>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Responsive Grid</h2>

        <div className="responsive-grid">
          {Array.from({ length: 12 }).map((_, index) => (
            <div className="grid-column" key={index}>
              {index + 1}
            </div>
          ))}
        </div>

        <p className="grid-note">
          Desktop: 12 columns / 80px / 24px gutter
          <br />
          Tablet: 8 columns / 24px gutter
          <br />
          Mobile: 4 columns / 16px gutter
        </p>
      </section>
    </main>
  );
}