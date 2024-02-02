import { Player, GameResult } from "@/app/page"
import { Box, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react"
import React, { memo, useEffect, useState } from "react"

type Props = {
    players: Player[]
    gameResults: GameResult[]
}
type SummaryBase = {
    id: number
    point: number
}

const ResultTables = memo(function ResultTables(props: Props) {
    const { players, gameResults } = props

    const [summaryBases, setSummaryBases] = useState<SummaryBase[]>([])
    const grs = gameResults.sort((a, b) => (a.count < b.count ? -1 : 1))

    useEffect(() => {
        if (!grs || !grs.length) {
            setSummaryBases([])
            return
        }
        const sumObjects = players.map(player => {
            const results = grs[grs.length - 1].results
            const summaryPints = results.filter(r => r.id == player.id)[0].point
            const summaryById: SummaryBase = {
                id: player.id,
                point: summaryPints,
            }
            return summaryById
        })
        const summarys = summaryBases.concat(sumObjects)
        setSummaryBases(summarys)
        console.log(summarys)
    }, [props.gameResults])

    return (
        <Box w={"100%"} h={"45%"}>
            <TableContainer w={"100%"} h={"100%"} overflowX="unset" overflowY="scroll">
                <Table>
                    <Thead position="sticky" top={0} zIndex="docked" bgColor={"gray.100"}>
                        <Tr px={1} py={1}>
                            {players.map(player => (
                                <Th px={1} py={1} key={player.id}>
                                    {player.name}
                                </Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody>
                        <ResultTr gameResults={grs} players={players} />
                    </Tbody>
                    <Tfoot position="sticky" bottom={0} bgColor={"gray.100"}>
                        <Tr px={1} py={1}>
                            {players.map(player => {
                                const summary = summaryBases
                                    .filter(summaryBase => summaryBase.id == player.id)
                                    .map(summaryBase => summaryBase.point)
                                    .reduce((sum, ele) => {
                                        return sum + ele
                                    }, 0)
                                return <Th px={1} py={1} key={player.id}>{`${summary} / ${summary * 50}`}</Th>
                            })}
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>
        </Box>
    )
})

export default ResultTables

type ResultPtops = {
    gameResults: GameResult[]
    players: Player[]
}

const ResultTr = function ResultTr(props: ResultPtops) {
    return props.gameResults.map(gr => {
        return (
            <Tr px={1} py={1} key={gr.count}>
                {props.players.map(player => {
                    const result = gr.results.filter(r => r.id == player.id)[0]
                    return (
                        <Td px={1} py={1} key={result.id}>
                            {result.point}
                        </Td>
                    )
                })}
            </Tr>
        )
    })
}
