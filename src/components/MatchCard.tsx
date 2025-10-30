import React from 'react';
import { Clock } from 'lucide-react';

const getElapsedTime = (matchTime, matchStatus) => {
    if (matchStatus === '90+') return 'Finished';
    if (matchStatus === 'Not Started') return 'Upcoming';
    const [minutes, suffix] = matchTime.split(/['+]/);
    if (!isNaN(minutes)) return `${minutes}'`;
    return matchTime;
};

const StatBar = ({ label, home, away }) => (
    <div className="flex items-center gap-2 mb-2">
        <div className="w-16 text-right text-sm">{home}</div>
        <div className="flex-1 relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
                className="absolute left-0 top-0 h-full bg-red-800 rounded-full transition-all duration-300"
                style={{ width: `${(parseInt(home) / (parseInt(home) + parseInt(away)) * 100) || 50}%` }}
            />
        </div>
        <div className="w-16 text-left text-sm">{away}</div>
    </div>
);

const MatchCard = ({ match }) => {
    const findStat = (type) => match.statistics?.find(stat => stat.type === type) || { home: '0', away: '0' };

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
            {/* League Header */}
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">{match.league_name}</span>
                    <div className={`
                        px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5
                        ${match.match_live === '1'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700'}
                    `}>
                        {match.match_live === '1' && (
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>
                        )}
                        {getElapsedTime(match.match_status, match.match_status)}
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{match.match_time}</span>
                </div>
            </div>

            <div className="p-4">
                {/* Teams & Score */}
                <div className="grid grid-cols-3 items-center gap-4 mb-6">
                    {/* Home Team */}
                    <div className="text-center space-y-2">
                        <div className="relative w-16 h-16 mx-auto">
                            <img
                                src={match.team_home_badge}
                                alt={match.match_hometeam_name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="font-medium text-sm text-gray-900 line-clamp-2">
                            {match.match_hometeam_name}
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                            {match.match_hometeam_score || '0'}
                        </div>
                    </div>

                    {/* VS */}
                    <div className="text-center">
                        <span className="text-sm font-medium text-gray-400">VS</span>
                    </div>

                    {/* Away Team */}
                    <div className="text-center space-y-2">
                        <div className="relative w-16 h-16 mx-auto">
                            <img
                                src={match.team_away_badge}
                                alt={match.match_awayteam_name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="font-medium text-sm text-gray-900 line-clamp-2">
                            {match.match_awayteam_name}
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                            {match.match_awayteam_score || '0'}
                        </div>
                    </div>
                </div>

                {/* Match Details Section */}
                <div className="space-y-6">
                    {/* Goal Scorers */}
                    {match.goalscorer?.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">⚽ Goal Scorers</h4>
                            <div className="space-y-1.5">
                                {match.goalscorer.map((goal, index) => (
                                    <div key={index} className="text-sm">
                                        {goal.home_scorer && (
                                            <div className="text-gray-600">
                                                {goal.time}' {goal.home_scorer}
                                                <span className="text-gray-400"> ({match.match_hometeam_name})</span>
                                            </div>
                                        )}
                                        {goal.away_scorer && (
                                            <div className="text-gray-600">
                                                {goal.time}' {goal.away_scorer}
                                                <span className="text-gray-400"> ({match.match_awayteam_name})</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Match Stats */}
                    {match.match_live === '1' && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Match Stats</h4>
                            <div className="space-y-3">
                                <StatBar
                                    label="Possession"
                                    home={findStat('Ball Possession').home}
                                    away={findStat('Ball Possession').away}
                                />
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="text-right">{findStat('Shots Total').home}</div>
                                    <div className="text-center text-gray-500">Shots</div>
                                    <div className="text-left">{findStat('Shots Total').away}</div>

                                    <div className="text-right">{findStat('Shots On Goal').home}</div>
                                    <div className="text-center text-gray-500">On Target</div>
                                    <div className="text-left">{findStat('Shots On Goal').away}</div>

                                    <div className="text-right">{findStat('Corners').home}</div>
                                    <div className="text-center text-gray-500">Corners</div>
                                    <div className="text-left">{findStat('Corners').away}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Match Events */}
                    {match.cards?.length > 0 && (
                        <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Cards</h4>
                            <div className="space-y-2">
                                {match.cards.map((card, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                        <span className="w-8 text-right text-gray-500">{card.time}'</span>
                                        <div className={`w-2 h-3 rounded-sm ${
                                            card.card.toLowerCase().includes('yellow')
                                                ? 'bg-yellow-400'
                                                : 'bg-red-500'
                                        }`} />
                                        <span className="text-gray-700">
                                            {card.home_fault || card.away_fault}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchCard;