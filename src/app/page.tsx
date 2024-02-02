"use client"
import { useState } from "react"
import config from "../../next.config.js" // 追加
import { Box, Button, HStack, Input, Stack, Text } from "@chakra-ui/react"
import ResultTables from "@/components/ResultTables"
const BASE_PATH = config.basePath ? config.basePath : "" // 追加

export type Player = {
    id: number
    name: string
}
type Score = {
    id: number
    score: number | undefined
}
type Result = {
    id: number
    name: string
    rank: number
    point: number
}
export type GameResult = {
    count: number
    results: Result[]
}

const createNewScore = (): Score[] => {
    return [
        { id: 1, score: undefined },
        { id: 2, score: undefined },
        { id: 3, score: undefined },
        { id: 4, score: undefined },
    ]
}

const createNewPlayers = (): Player[] => {
    return [
        { id: 1, name: "東" },
        { id: 2, name: "南" },
        { id: 3, name: "西" },
        { id: 4, name: "北" },
    ]
}

export default function Home() {
    /**ゲームカウント */
    const [gameCount, setGameCount] = useState<number>(1)
    /**プレイヤー */
    const [players, setPlayers] = useState<Player[]>(createNewPlayers())
    /**入力スコア */
    const [scores, setScores] = useState<Score[]>(createNewScore())
    /**チェック可否 */
    const [canNotCheck, setCanNotCheck] = useState(true)
    /**今回ゲームの結果 */
    const [currentResults, setCurrentResults] = useState<Result[]>([])
    /**全ゲームの結果 */
    const [gameResults, setGameResults] = useState<GameResult[]>([])

    /**
     * データ初期化
     */
    const newGame = () => {
        setGameCount(1)
        setGameResults([])
        setPlayers(createNewPlayers())
        allClear()
    }

    const nextGame = () => {
        const addResult: GameResult = {
            count: gameCount,
            results: currentResults,
        }
        const newGameResults = gameResults.concat(addResult)
        setGameResults(newGameResults)
        setGameCount(gameCount + 1)
        allClear()
    }

    const allClear = () => {
        setScores(createNewScore())
        setCanNotCheck(true)
        setCurrentResults([])
    }

    /**
     * プレイヤー名の変更
     * @param id id
     * @param value プレイヤー名
     */
    const changePlayerName = (id: number, value: string): void => {
        const newPlayer = players.map(player => {
            if (player.id == id) {
                player.name = value
            }
            return player
        })
        setPlayers(newPlayer)
    }

    /**
     * 点数の入力
     * @param id id
     * @param value 点数
     */
    const changeScore = (id: number, value: string): void => {
        let newScores = scores.map(score => {
            if (score.id == id && value) {
                score.score = Number(value) <= 0 ? 0 : Number(value)
            }
            return score
        })

        // 3人いれたら自動計算
        const inputed = newScores.filter(score => score.score != undefined).map(score => score.score)
        if (inputed.length == 3) {
            const sumPoint = inputed.reduce((sum, ele) => {
                if (sum != undefined && ele != undefined) {
                    return sum + ele
                }
            }, 0)
            newScores = newScores.map(newScore => {
                if (newScore.score == undefined && sumPoint != undefined) {
                    newScore.score = 25000 * 4 - sumPoint
                }
                return newScore
            })
        }

        setScores(newScores)
        setVerification()
    }

    /**
     * チェック可否設定
     * @returns void
     */
    const setVerification = (): void => {
        if (scores.filter(score => score.score == undefined).length) {
            setCanNotCheck(true)
            return
        }
        const total = scores
            .map(score => score.score)
            .reduce((sum, ele) => {
                if (sum != undefined && ele != undefined) {
                    return sum + ele
                }
            }, 0)
        setCanNotCheck(total != 25000 * 4)
    }

    /**
     * 入力削除
     * @param id id
     */
    const deleteInput = (id: number): void => {
        const newScores = scores.map(score => {
            if (score.id == id) {
                score.score = undefined
            }
            return score
        })
        setScores(newScores)
        setVerification()
        setCurrentResults([])
    }

    /**
     * チェック実施
     */
    const doCheck = (): void => {
        const sortScore = scores.sort((a, b) => ((a.score || 0) < (b.score || 0) ? -1 : 1)) // 昇順
        const points: number[] = []
        const results = sortScore
            .map((ss, index) => {
                const rank = sortScore.length - index
                const point = calcScore(rank, ss.score || 0, points)
                points.push(point)
                const result: Result = {
                    name: players.filter(player => player.id == ss.id)[0].name,
                    id: ss.id,
                    rank: rank,
                    point: point,
                }
                return result
            })
            .sort((a, b) => (a.rank < b.rank ? -1 : 1))

        setCurrentResults(results)
    }

    /**
     * ポイント算出
     * @param rank 順位
     * @param score 点数
     * @param points ポイントのリスト
     * @returns ポイント
     */
    const calcScore = (rank: number, score: number, points: number[]): number => {
        const basePint = (score: number) => {
            return Math.round(score / 1000)
        }
        if (rank == 4) return basePint(score) - 50
        if (rank == 3) return basePint(score) - 40
        if (rank == 2) return basePint(score) - 20

        // rank == 1
        return points.reduce((sum, ele) => {
            return sum + ele * -1
        }, 0)
    }

    return (
        <Stack h={"100%"} p={3}>
            <Button variant={"solid"} w={"5rem"} colorScheme={"red"} onClick={newGame}>
                newGame
            </Button>
            <ResultTables players={players} gameResults={gameResults} />
            <Stack mt={"auto"} mb={4}>
                <Stack>
                    {players.map(player => (
                        <HStack gap={1} key={player.id}>
                            <Input
                                p={1}
                                w={"30%"}
                                variant={"filled"}
                                maxLength={3}
                                key={player.name}
                                defaultValue={player.name}
                                onBlur={e => changePlayerName(player.id, e.target.value)}
                            />
                            <Input
                                p={1}
                                w={"70%"}
                                type="number"
                                key={scores.filter(score => score.id == player.id)[0].score}
                                defaultValue={scores.filter(score => score.id == player.id)[0].score}
                                onBlur={e => changeScore(player.id, e.target.value)}
                            />
                            <Button w={"4.5rem"} onClick={e => deleteInput(player.id)}>
                                clear
                            </Button>
                        </HStack>
                    ))}
                    <HStack alignItems={"flex-start"} mt={4}>
                        <HStack gap={5}>
                            {currentResults.map(cr => (
                                <Box key={cr.id}>
                                    <Text fontSize={"small"}>{cr.name}</Text>
                                    <HStack>
                                        <Text fontSize={"small"}>{cr.rank}</Text>
                                        <Text fontSize={"small"}>{cr.point}</Text>
                                    </HStack>
                                </Box>
                            ))}
                        </HStack>
                        <Button ms={"auto"} w={"4.5rem"} onClick={allClear}>
                            allClear
                        </Button>
                    </HStack>
                </Stack>
            </Stack>
            <HStack gap={4} ms={"auto"}>
                <HStack>
                    <Button
                        variant={"outline"}
                        isDisabled={canNotCheck}
                        w={"5rem"}
                        colorScheme={"blue"}
                        onClick={doCheck}
                    >
                        check
                    </Button>
                    <Button
                        variant={"solid"}
                        w={"5rem"}
                        colorScheme={"blue"}
                        isDisabled={!currentResults.length}
                        onClick={nextGame}
                    >
                        next
                    </Button>
                </HStack>
            </HStack>
        </Stack>
    )
}
