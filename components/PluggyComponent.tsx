'use client'
import { PluggyConnect, PluggyConnectProps } from 'pluggy-connect-sdk'
import { Item } from 'pluggy-js'
import { useEffect, useState } from 'react'

function usePluggyConnect({
  url,
  connectToken: preConfiguredToken,
  selectedConnectorId
}: {
  url?: string
  connectToken?: string
  selectedConnectorId?: number
}): {
  open: () => Promise<void> | undefined
  ready: boolean
  data: Item | undefined
  error: { message: string } | undefined
} {
  const [pluggyConnect, setPluggyConnect] = useState<PluggyConnect>()
  const [data, setData] = useState<Item>()
  const [error, setError] = useState<{ message: string }>()

  const pluggyConnectOptions: Partial<PluggyConnectProps> = {
    includeSandbox: true,
    onSuccess: (data) => setData(data.item),
    onError: (error) => setError(error),
    selectedConnectorId
  }

  useEffect(() => {
    if (preConfiguredToken) {
      setPluggyConnect(
        new PluggyConnect({ ...pluggyConnectOptions, connectToken: preConfiguredToken })
      )
      return
    }

    if (!url) {
      throw new Error(`You must provide either a "connectToken" or a "url"`)
    }

    fetch(url, {
      method: 'POST'
    })
      .then((res) => res.json() as unknown as { connectToken: string })
      .then(({ connectToken }) => {
        setPluggyConnect(new PluggyConnect({ ...pluggyConnectOptions, connectToken }))
      })
  }, [])

  return {
    open: () => pluggyConnect?.init(),
    ready: !!pluggyConnect,
    data,
    error
  }
}

export default function PluggyComponent({ selectedConnectorId }: { selectedConnectorId?: number }) {
  const { open, ready, data, error } = usePluggyConnect({
    url: '/api/connect-token',
    selectedConnectorId
  })

  useEffect(() => {
    if (ready) {
      open()
    }
  }, [ready])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {!ready
        ? 'Loading'
        : data
        ? JSON.stringify(data, null, 2)
        : error
        ? error.message
        : 'Connect your account: '}
    </main>
  )
}
