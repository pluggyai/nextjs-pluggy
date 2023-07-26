import PluggyComponent from '@/components/PluggyComponent'

export default function Home({ searchParams }: { searchParams: any }) {
  const { connector_id } = searchParams
  return <PluggyComponent selectedConnectorId={parseInt(connector_id)} />
}
