'use client'

/* eslint-disable react-hooks/exhaustive-deps */
import { decodeJwt } from 'jose'
import { isVariableValid } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function useValidAccessToken() {
   const [returnAccessToken, setReturnAccessToken] = useState(null)
   let AccessToken: string, RefreshToken: string

   useEffect(() => {
      try {
         if (typeof window !== 'undefined' && window.localStorage) {
            AccessToken = window.localStorage.getItem('AccessToken')
            RefreshToken = window.localStorage.getItem('RefreshToken')

            if (isVariableValid(AccessToken) && isVariableValid(RefreshToken)) {
               const { exp, iat } = decodeJwt(AccessToken)

               async function fetchData() {
                  if (exp < Math.floor(new Date().getTime() / 1000)) {
                     const response = await fetch(`/api/auth/refresh`, {
                        headers: {
                           Authorization: `Bearer ${RefreshToken}`,
                        },
                     })

                     const json = await response.json()

                     const RefreshedAccessToken = json?.AccessToken

                     if (isVariableValid(RefreshedAccessToken)) {
                        window.localStorage.setItem(
                           'AccessToken',
                           RefreshedAccessToken
                        )
                        setReturnAccessToken(RefreshedAccessToken)
                     }
                  } else {
                     setReturnAccessToken(AccessToken)
                  }
               }

               fetchData()
            }
         }
      } catch (error) {
         console.error({ error })
      }
   }, [])

   return { AccessToken: returnAccessToken }
}
