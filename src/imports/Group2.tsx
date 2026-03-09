import svgPaths from "./svg-ox64v1n20p";

export default function Group() {
  return (
    <div className="relative size-full">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 113 114.032">
        <g clipPath="url(#clip0_69_282)" id="Group 2">
          <g id="Ellipse 409">
            <ellipse cx="56.5" cy="57.0158" fill="var(--fill-0, #FFAA01)" rx="56.5" ry="57.016" />
            <path d={svgPaths.p2585dd80} fill="var(--stroke-0, #FEAA01)" />
          </g>
          <g filter="url(#filter0_d_69_282)" id="Ellipse 411">
            <path d={svgPaths.p1c7c0c00} fill="var(--stroke-0, #2619D0)" />
          </g>
          <g filter="url(#filter1_d_69_282)" id="Ellipse 410">
            <path d={svgPaths.p9870a80} fill="var(--stroke-0, #E81A01)" />
          </g>
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="103.039" id="filter0_d_69_282" width="102.262" x="4.77873" y="9.34624">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2.9" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.909804 0 0 0 0 0.101961 0 0 0 0 0.00392157 0 0 0 1 0" />
            <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_69_282" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow_69_282" mode="normal" result="shape" />
          </filter>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="84.9375" id="filter1_d_69_282" width="86.0529" x="14.2576" y="14.4284">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset />
            <feGaussianBlur stdDeviation="1.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.14902 0 0 0 0 0.0980392 0 0 0 0 0.815686 0 0 0 1 0" />
            <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_69_282" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow_69_282" mode="normal" result="shape" />
          </filter>
          <clipPath id="clip0_69_282">
            <rect fill="white" height="114.032" width="113" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}