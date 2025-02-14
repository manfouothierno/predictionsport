import {ChevronRight, Clock} from "lucide-react";
import Link from "next/link";


export const PredictionCard = ({match}: {match: any}) => {
    return (
        <Link
            key={match.match_id}
            href={`/predictions/analysis/${match.match_id}`}
            className="block group focus:outline-none focus:ring-2 focus:ring-red-500 rounded-xl"
        >
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-100">
                {/* League & Time Header */}
                <div className="bg-gradient-to-r shadow-sm  from-gray-50 to-white px-4 py-2.5 flex items-center justify-center  border-b">
                    <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 bg-white rounded-full p-0.5 shadow-sm">
                            <img
                                src={match.league_logo || '/placeholder-league.png'}
                                alt={match.league_name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="text-sm text-black  font-bold truncate">
                                                        {match.league_name}
                                                    </span>
                    </div>

                </div>

                <div className="px-4 py-3">
                    {/* Teams */}
                    <div className="flex items-center justify-between gap-4">
                        {/* Home Team */}
                        <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
                            <div className="w-16 h-16 rounded-full bg-gray-50 p-1.5 flex-shrink-0">
                                <img
                                    src={match.team_home_badge}
                                    alt={match.match_hometeam_name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="text-sm font-medium text-gray-900 truncate">
                                                            {match.match_hometeam_name}
                                                        </span>
                        </div>

                        {/* VS */}
                        {/*<span className="text-sm font-medium text-gray-400">VS</span>*/}
                        {/* Match Status & Action */}
                        <div className="flex items-center  flex-col justify-between px-3 gap-2">
                            <span className="text-xs font-bold text-black">Match time & date: </span>
                            <div className="inline-flex items-center px-2 py-1 bg-gray-50 rounded-md">

                                                    <span className="text-xs font-medium text-black">
                                                           {match.match_date}
                                                        </span>
                            </div>
                            <div className="inline-flex items-center px-2 py-1 bg-gray-50 rounded-md">
                                <Clock className="w-3.5 h-3.5 text-black mr-1.5" />
                                <span className="text-xs font-medium text-black">
                                                           {match.match_time}
                                                        </span>
                            </div>

                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center gap-3 flex-1 min-w-0 justify-end">
                            <div className="w-16 h-16 rounded-full bg-gray-50 p-1.5 flex-shrink-0">
                                <img
                                    src={match.team_away_badge}
                                    alt={match.match_awayteam_name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="text-sm font-medium text-gray-900 truncate">
                                                            {match.match_awayteam_name}
                                                        </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center mt-[-15px] pt-3 ">
                        <button className="flex items-center  gap-1.5 text-xs font-bold text-white bg-red-600 group-hover:bg-red-700 px-2 py-2 rounded-[5px] ">
                            VIEW PREDICTION
                            {/*<ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />*/}
                        </button>
                    </div>

                </div>
            </div>
        </Link>
    )
}