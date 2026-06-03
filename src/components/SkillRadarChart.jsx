import { useEffect, useMemo, useRef, useState } from "react";

const SKILLS = [
    { key: "accuracy", label: "ACC" },
    { key: "speed", label: "SPD" },
    { key: "jack", label: "JCK" },
    { key: "stamina", label: "STA" },
    { key: "tech", label: "TEC" },
    { key: "release", label: "LN" },
    { key: "reading", label: "RDG" },
];

const SIZE = 280;
const CENTER = SIZE / 2;
const MAX_RADIUS = 100;

export const SkillRadarChart = ({ skills, setSkills, themeColors }) => {
    const svgRef = useRef(null);

    const [activeSkill, setActiveSkill] = useState(null);

    const getAxisPoint = (radius, index) => {
        const angle = (Math.PI * 2 * index) / SKILLS.length - Math.PI / 2;

        return {
            x: CENTER + radius * Math.cos(angle),

            y: CENTER + radius * Math.sin(angle),
        };
    };

    const getSkillPoint = (value, index) => {
        return getAxisPoint((value / 100) * MAX_RADIUS, index);
    };

    const polygonPoints = useMemo(() => {
        return SKILLS.map((skill, index) => {
            const point = getSkillPoint(skills[skill.key], index);

            return `${point.x},${point.y}`;
        }).join(" ");
    }, [skills]);

    const updateSkillValue = (clientX, clientY, skillKey, index) => {
        const rect = svgRef.current.getBoundingClientRect();

        const mouseX = clientX - rect.left;

        const mouseY = clientY - rect.top;

        const dx = mouseX - CENTER;

        const dy = mouseY - CENTER;

        const angle = (Math.PI * 2 * index) / SKILLS.length - Math.PI / 2;

        const projected = dx * Math.cos(angle) + dy * Math.sin(angle);

        const value = Math.max(
            0,
            Math.min(100, Math.round((projected / MAX_RADIUS) * 100)),
        );

        setSkills((prev) => ({
            ...prev,
            [skillKey]: value,
        }));
    };

    useEffect(() => {
        const handleMove = (e) => {
            if (!activeSkill) return;

            updateSkillValue(
                e.clientX,
                e.clientY,
                activeSkill.key,
                activeSkill.index,
            );
        };

        const handleUp = () => {
            setActiveSkill(null);
        };

        window.addEventListener("mousemove", handleMove);

        window.addEventListener("mouseup", handleUp);

        return () => {
            window.removeEventListener("mousemove", handleMove);

            window.removeEventListener("mouseup", handleUp);
        };
    }, [activeSkill]);

    return (
        <div className="flex justify-center">
            <svg
                ref={svgRef}
                width={SIZE}
                height={SIZE}
                className="overflow-visible">
                {/* GRID */}

                {[20, 40, 60, 80, 100].map((level) => {
                    const radius = (level / 100) * MAX_RADIUS;

                    const points = SKILLS.map((_, index) => {
                        const point = getAxisPoint(radius, index);

                        return `${point.x},${point.y}`;
                    }).join(" ");

                    return (
                        <polygon
                            key={level}
                            points={points}
                            fill="none"
                            stroke="rgba(255,255,255,.08)"
                        />
                    );
                })}

                {/* AXIS */}

                {SKILLS.map((skill, index) => {
                    const point = getAxisPoint(MAX_RADIUS, index);

                    return (
                        <line
                            key={skill.key}
                            x1={CENTER}
                            y1={CENTER}
                            x2={point.x}
                            y2={point.y}
                            stroke="rgba(255,255,255,.08)"
                        />
                    );
                })}

                {/* AREA */}

                <polygon
                    points={polygonPoints}
                    fill={themeColors.primary}
                    fillOpacity="0.25"
                    stroke={themeColors.primary}
                    strokeWidth="2"
                />

                {/* HANDLES */}

                {SKILLS.map((skill, index) => {
                    const point = getSkillPoint(skills[skill.key], index);

                    const labelPoint = getAxisPoint(MAX_RADIUS + 35, index);

                    return (
                        <g key={skill.key}>
                            {/* label */}

                            <g>
                                <text
                                    x={labelPoint.x}
                                    y={labelPoint.y - 6}
                                    textAnchor="middle"
                                    fill="#fff"
                                    fontSize="11"
                                    fontWeight="700">
                                    {skill.label}
                                </text>

                                <text
                                    x={labelPoint.x}
                                    y={labelPoint.y + 10}
                                    textAnchor="middle"
                                    fill={themeColors.primary}
                                    fontSize="10"
                                    fontWeight="600">
                                    {skills[skill.key]}
                                </text>
                            </g>

                            {/* handle */}

                            <circle
                                cx={point.x}
                                cy={point.y}
                                r="5"
                                fill={themeColors.primary}
                                stroke="#fff"
                                strokeWidth="2"
                                className="cursor-grab active:cursor-grabbing"
                                onMouseDown={() =>
                                    setActiveSkill({
                                        key: skill.key,
                                        index,
                                    })
                                }
                            />
                        </g>
                    );
                })}

                {/* center */}

                <circle cx={CENTER} cy={CENTER} r="4" fill="#ffffff" />
            </svg>
        </div>
    );
};
