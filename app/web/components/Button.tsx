export default function Button(props : { text: string, onClick?: any, enabled: boolean, classes?: string[] } = { text: "buttonText", onClick: () => {},  enabled: true, classes: [] }) {
  let buttonClassName = [
    "rounded-2xl",
    "bg-violet-600",
    "mt-4",
    "p-6",
    "w-56",
  ];

  if (props.classes) {
    buttonClassName = [
      ...buttonClassName,
      ...props.classes,
    ]
  }

  if (!props.enabled) {
    buttonClassName = [
      ...buttonClassName,
      "bg-slate-300",
      "text-black",
      "opacity-50",
    ];
  } else {
    buttonClassName = [
      ...buttonClassName,
      "hover:ring",
      "hover:ring-white",
      "hover:bg-violet-400",
      "focus:ring",
      "focus:ring-white",
      "focus:bg-violet-600",
      "active:bg-slate-300",
      "active:text-black",
    ];
  }

  return (
    <button 
      disabled={!props.enabled}
      className={buttonClassName.join(" ")}
      onClick={props.onClick}
    >
      { props.text }
    </button>
  )
};
