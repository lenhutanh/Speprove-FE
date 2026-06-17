import { ForecastType } from '@/types'
import ForecastCard from './forecast-card'

export default function ForecastList({
  forecasts,
}: {
  forecasts: ForecastType[]
}) {
  return (
    <div className='grid w-full grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
      {forecasts?.map((forecast, index) => (
        <ForecastCard key={index} forecast={forecast} />
      ))}
    </div>
  )
}
