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
        <Box w={"100%"}>
            <TableContainer overflowX="unset" overflowY="unset">
                <Table variant="simple">
                    <Thead position="sticky" top={0} zIndex="docked">
                        <Tr>
                            {players.map(player => (
                                <Th key={player.id}>{player.name}</Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody>
                        <ResultTr gameResults={grs} players={players} />
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            {players.map(player => {
                                const summary = summaryBases
                                    .filter(summaryBase => summaryBase.id == player.id)
                                    .map(summaryBase => summaryBase.point)
                                    .reduce((sum, ele) => {
                                        return sum + ele
                                    }, 0)
                                return <Th key={player.id}>{`${summary} / ${summary * 50}`}</Th>
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
            <Tr key={gr.count}>
                {props.players.map(player => {
                    const result = gr.results.filter(r => r.id == player.id)[0]
                    return <Td key={result.id}>{result.point}</Td>
                })}
            </Tr>
        )
    })
}
