import "./style.css";

const InfiniteMarquee = ( { right }) => {
  const companies = [
    "Microsoft",
    "Google",
    "Amazon",
    "Meta",
    "Apple",
    "Uber",
    "Airbnb",
    "Tesla",
    "Netflix",
    "Spotify",
    "Twitter",
    "LinkedIn",
    "Adobe",
    "Slack",
    "Zoom",
  ];

  return (
    <div className={right? "fixed h-screen right-0 overflow-hidden flex items-center": "fixed h-screen left-0 overflow-hidden flex items-center"}>
      <div className="relative h-full overflow-hidden border-l border-r border-slate-800/50 bg-black/60 backdrop-blur-xl">
        <div className="flex flex-col items-center space-y-8 animate-marquee-vertical">
          {companies.concat(companies).map((company, index) => (
            <span
              key={index}
              className="text-center text-xl sm:text-2xl md:text-3xl font-light text-slate-400 hover:text-cyan-400 transition-colors cursor-default px-8 whitespace-nowrap"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteMarquee;
