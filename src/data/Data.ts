export type TGameData = {
  mod: string;
  name: string;
  description: string;
  color: string;
  icon: string;
};

export const Data: { mods: TGameData[] } = {
  mods: [
    { mod: "ra", name: "Red Alert", description: "", icon: "ra.png", color: "#650b03" },
    {
      mod: "ura",
      name: "Red Alert Unplugged",
      description: "",
      icon: "ura.png",
      color: "#66707c"
    },
    { mod: "cnc", name: "Tiberian Dawn", description: "", icon: "cnc.png", color: "#2e3c29" },
    { mod: "d2k", name: "Dune 2000", description: "", icon: "d2k.png", color: "#96693e" },
    { mod: "d2", name: "Dune 2", description: "", icon: "d2.png", color: "#c88e45" },
    { mod: "ts", name: "Tiberian Sun", description: "", icon: "ts.png", color: "#486916" },
    { mod: "ra2a", name: "Red Alert 2", description: "", icon: "ra2a.png", color: "#ff4915" },
    { mod: "gen", name: "Generals Alpha", description: "", icon: "gen.png", color: "#dcaa2e" },
    { mod: "cd", name: "Crystallized Doom", description: "", icon: "cd.png", color: "#1d0e87" }
  ]
};
