import { ForecastResType } from '@/types'
import ForecastCard from './forecast-card'

export default function ForecastList({
  forecasts,
}: {
  forecasts: ForecastResType[]
}) {
  return (
    <div className='grid w-full grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4'>
      {forecasts.map((forecast, index) => (
        <ForecastCard key={index} forecast={forecast} />
      ))}
    </div>
  )
}
