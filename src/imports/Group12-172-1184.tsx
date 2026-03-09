import svgPaths from "./svg-fctbl5ib6a";

function Group() {
  return (
    <div className="absolute left-0 size-[206px] top-0">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 206 206">
        <g id="Group 4">
          <circle cx="103" cy="103" fill="var(--fill-0, #F5F4F4)" id="Ellipse 416" r="89" stroke="var(--stroke-0, #FFEABF)" strokeWidth="28" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-0 top-0">
      <Group />
    </div>
  );
}

function SmilingFaceHighContrastStreamlineFluentEmojiHighContrast() {
  return (
    <div className="absolute left-[29.96px] size-[144.2px] top-[39.33px]" data-name="Smiling-Face-High-Contrast Streamline Fluent-Emoji-High-Contrast">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 144.2 144.2">
        <g id="Smiling-Face-High-Contrast Streamline Fluent-Emoji-High-Contrast">
          <rect fill="#F5F4F4" height="144.2" width="144.2" />
          <path d={svgPaths.p2e179af0} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p327d86f2} fill="var(--fill-0, black)" id="Vector_2" />
          <path d={svgPaths.pbc30d00} fill="var(--fill-0, black)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[29.96px] top-[39.33px]">
      <SmilingFaceHighContrastStreamlineFluentEmojiHighContrast />
    </div>
  );
}

export default function Group3() {
  return (
    <div className="relative size-full">
      <Group1 />
      <Group2 />
    </div>
  );
}