import {CSSProperties, PropsWithChildren} from "react";

interface Props {
  width: number;
  height: number;
  xp?: number;
}

const XpBar = (xp: number) => {
  const xpNext = (xp: number) => {
    let cLevel = get_level(xp)
    if (cLevel === 100) {
      return {
        next: 0,
        progress: 100
      }
    } else {
      let cLevelXp = Math.round(Math.pow(cLevel, (3 + ((cLevel)/200))))
      let nLevelXp = Math.round(Math.pow(cLevel + 1, (3 + ((cLevel + 1)/200))))

      return {
        next: nLevelXp - xp,
        progress: Math.round( (xp - cLevelXp) / (nLevelXp - cLevelXp) * 100)
      }
    }
  }

  return (
    <div
          style={{
            backgroundColor: "white",
            border: "1px solid black",
            borderTopWidth: "0px",
            width: "100%",
            height: "16px",
            fontSize: "12px",
            color: "grey",
            position: "relative",
          }}>
            <span
              style={{
                lineHeight: "16px",
                position: "absolute",
                zIndex: 1,
                padding: "0 4px",
              }}>
              LEVEL {get_level(xp)}
            </span>
            <div
              style={{
                backgroundColor: "#00FF00",
                width: xpNext(xp).progress + "%",
                height: "15px",
                position: "absolute",
              }} />
            <span
              style={{
                lineHeight: "16px",
                padding: "0 4px",
                position: "absolute",
                zIndex: 1,
                right: "0px",
              }}>
                {xpNext(xp).next} xp
              </span>
          </div>
  )
}

const OverviewBox = ({ width, height, xp, children, ...style }: PropsWithChildren<Props> & CSSProperties) => {

  return (
    <div
      style={{
        display: "flex",
        height: `${height}px`,
        width: `${width}px`,
        gap: "5px",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#b1d6dc",
        padding: "0 10px 10px 10px",
        boxSizing: "content-box",
        ...style
      }}
    >
      {xp && XpBar(xp)}
      {children}
    </div>
  );
};

export default OverviewBox;
