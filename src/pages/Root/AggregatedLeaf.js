import * as d3 from "d3";

export default function AggregatedLeaf({
  item,
  onClick,
  innerRadius,
  outerRadius,
}) {
  const arc = d3
    .arc()
    .startAngle((d) => d.startAngle + Math.PI / 2)
    .endAngle((d) => d.endAngle + Math.PI / 2)
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);
  const dt = Math.PI / 120;
  const wordCount = Math.floor(
    (item.endAngle - item.startAngle - item.padAngle) / dt
  );
  const groupsPie = d3
    .pie()
    .startAngle(item.startAngle + item.padAngle / 2)
    .endAngle(item.endAngle - item.padAngle / 2)
    .sortValues(() => 0)
    .value((d) => d.count);
  const groupArcs = groupsPie(item.data.data.groups);
  return (
    <g className="is-clickable" onClick={onClick}>
      <g>
        {groupArcs.map((group) => {
          return (
            <g key={group.data.group}>
              <path d={arc(group)} fill={group.data.color} />
            </g>
          );
        })}
      </g>
      <path d={arc(item)} fill="none" stroke="#888" />
      <g>
        {item.data.data.words.slice(0, wordCount).map((word, i) => {
          const t = item.startAngle + item.padAngle + dt * i + dt / 2;
          return (
            <g
              key={word.word}
              transform={
                Math.cos(item.startAngle) >= 0
                  ? `rotate(${(t * 180) / Math.PI})translate(${
                      outerRadius + 5
                    })`
                  : `rotate(${(t * 180) / Math.PI + 180})translate(${
                      -outerRadius - 5
                    })`
              }
            >
              <text
                fill={word.color}
                fontSize="10"
                fontWeight="bold"
                textAnchor={Math.cos(item.startAngle) >= 0 ? "start" : "end"}
                dominantBaseline="central"
              >
                {word.word}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
}
