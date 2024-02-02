// app/layout.tsx
import { Box } from "@chakra-ui/react"
import { Providers } from "./providers"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja">
            <body>
                <Providers>
                    <Box h={"100vh"} w={"100vw"}>
                        {children}
                    </Box>
                </Providers>
            </body>
        </html>
    )
}
