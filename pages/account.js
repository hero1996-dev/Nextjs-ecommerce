import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
    useToasts,
    Description,
    Text,
    Loading,
    Card,
    Grid,
    useTheme,
} from '@geist-ui/core'

import Layout from '../components/Layout'
import { themePreference } from '../state/Theme'
import config from '../main.config'
import withAuth from '../HOCs/withAuth'
import { handleAccountData } from '../helpers/handlers'

export default withAuth(function () {
    const title = 'Account'
    const description = 'Account Sample Page'

    const theme = useTheme()
    const router = useRouter()
    const { setToast } = useToasts()
    const [account, setAccount] = useState({})

    async function resolve() {
        const response = await axios.get(config.backend.routes.account)
        handleAccountData(response, router, setAccount, setToast)
    }

    useEffect(() => {
        resolve()
    }, [])

    return (
        <Layout
            config={config}
            themePreference={themePreference}
            crownLarge={title}
            crownSmall={description}
            metaTitle={title}
        >
            <Grid.Container gap={1}>
                <Grid xs={24}>
                    <Card
                        style={{
                            backgroundColor: `${theme.palette.accents_1}`,
                        }}
                        width="100%"
                    >
                        {account ? (
                            <Description
                                title="Email"
                                content={account.email}
                            />
                        ) : (
                            <Loading />
                        )}
                    </Card>
                </Grid>
            </Grid.Container>
        </Layout>
    )
})