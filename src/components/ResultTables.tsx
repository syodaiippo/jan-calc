import { Player, GameResult } from "@/app/page"
import { Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react"
import React, { memo } from "react"

type Props = {
    players: Player[]
    gameResults: GameResult[]
}
const ResultTables = memo((props: Props) => {
    const { players, gameResults } = props
    const grs = gameResults.sort((a, b) => (a.count < b.count ? -1 : 1))
    return (
        <TableContainer>
            <Table size="sm">
                <Thead>
                    <Tr>
                        {players.map(player => (
                            <Th key={player.id}>{player.name}</Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    <ResultTr gameResults={grs} players={players} />
                </Tbody>
                <Tfoot></Tfoot>
            </Table>
        </TableContainer>
    )
})

export default ResultTables

type ResultPtops = {
    gameResults: GameResult[]
    players: Player[]
}
const ResultTr = (props: ResultPtops) => {
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
