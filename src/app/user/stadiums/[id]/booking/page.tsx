'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { FiCalendar, FiClock, FiCreditCard, FiDollarSign, FiUser } from 'react-icons/fi'
import Header from '@/app/components/user/layout/Header'
import Footer from '@/app/components/user/layout/Footer'

const StadiumBookingPage = () => {
  const router = useRouter()
  const params = useParams()
  const stadiumId = params.id

  // Mock stadium data - in a real app, you'd fetch this based on stadiumId
  const stadium = {
    id: stadiumId,
    name: "Elite Stadium Downtown",
    price: 25, // price per hour
    maxHours: 4, // maximum booking duration
    openingTime: 9, // 9 AM
    closingTime: 22 // 10 PM
  }

  // State for form
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [duration, setDuration] = useState(1) // default 1 hour
  const [players, setPlayers] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('credit')

  // Calculate end time
  const endTime = startTime ? 
    new Date(new Date(`2000-01-01T${startTime}`).getTime() + duration * 60 * 60 * 1000)
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

  // Calculate total price
  const totalPrice = stadium.price * duration

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = stadium.openingTime; hour < stadium.closingTime; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`
      slots.push(time)
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would process the booking here
    console.log({
      stadiumId,
      date,
      startTime,
      duration,
      players,
      totalPrice,
      paymentMethod
    })
    // Then redirect to payment confirmation
    // router.push(`/user/stadiums/${stadiumId}/booking/confirmation`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header darkMode={false} setDarkMode={() => {}} />
      <div className="container mx-auto px-4 py-18">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Book {stadium.name}</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <FiClock className="mr-2 text-gray-500" />
                <span className="font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center">
                <FiUser className="mr-2 text-gray-500" />
                <span className="font-medium">{players} player{players > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center">
                <FiDollarSign className="mr-2 text-gray-500" />
                <span className="font-medium">${stadium.price} per hour</span>
              </div>
              <div className="flex items-center">
                <FiCreditCard className="mr-2 text-gray-500" />
                <span className="font-medium">Total: ${totalPrice}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Booking Details</h2>
            
            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <FiCalendar className="absolute right-3 top-3.5 text-gray-400" />
                </div>
              </div>

              {/* Start Time Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Start Time</label>
                <div className="relative">
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                    required
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  <FiClock className="absolute right-3 top-3.5 text-gray-400" />
                </div>
              </div>

              {/* Duration Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Duration (hours)</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {[...Array(stadium.maxHours)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1}</option>
                  ))}
                </select>
                {startTime && (
                  <p className="mt-2 text-sm text-gray-500">
                    Your session will end at {endTime}
                  </p>
                )}
              </div>

              {/* Number of Players */}
              <div>
                <label className="block text-sm font-medium mb-2">Number of Players</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={players}
                  onChange={(e) => setPlayers(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      value="credit"
                      checked={paymentMethod === 'credit'}
                      onChange={() => setPaymentMethod('credit')}
                      className="h-5 w-5 text-green-500 focus:ring-green-500"
                    />
                    <span>Credit Card</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="h-5 w-5 text-green-500 focus:ring-green-500"
                    />
                    <span>PayPal</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all mt-6"
                disabled={!date || !startTime}
              >
                Proceed to Payment
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default StadiumBookingPage