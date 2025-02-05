"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { jwtDecode } from "jwt-decode"
import axios from "axios"

const WelcomePage = () => {
  const navigate = useNavigate()
  const { token } = useParams()
  const [inviteData, setInviteData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUserCommunityAccess = async () => {
      try {
        const storedToken = localStorage.getItem("token")
        if (storedToken) {
          const decoded = jwtDecode(storedToken)
          const userId = decoded.userId

          const communitiesResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/communities/getAllCommunitiesForCustomers?userId=${userId}`,
            {
              headers: {
                "auth-token": storedToken,
              },
            },
          )

          if (communitiesResponse.data?.data) {
            const userCommunities = communitiesResponse.data.data

            const inviteResponse = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/testimonials/validate/${token}`,
            )

            if (inviteResponse.data) {
              const invitedCommunityId = inviteResponse.data.communityId

              const isAlreadyMember = userCommunities.some((community) => community._id === invitedCommunityId)

              if (isAlreadyMember) {
                navigate("/family")
                return
              }

              setInviteData({
                ...inviteResponse.data.data,
                communityId: invitedCommunityId,
              })
            } else {
              toast.error("Invalid or expired invitation link")
              navigate("/")
            }
          }
        } else {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/testimonials/validate/${token}`)

          if (response.data) {
            setInviteData({
              ...response.data.data,
              communityId: response.data.communityId,
            })
          } else {
            toast.error("Invalid or expired invitation link")
            navigate("/")
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to validate invitation link")
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    if (!token || token.length !== 64) {
      toast.error("Invalid invitation link structure")
      navigate("/")
      return
    }

    checkUserCommunityAccess()
  }, [token, navigate])

  const handleGetStarted = () => {
    navigate(`/invite/${token}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16">
      <h1 className="text-5xl font-bold mb-8 text-center">
        Welcome to <span className="text-blue-500">{inviteData?.name}</span>
      </h1>

      <div className="max-w-2xl w-full space-y-8">
        <h2 className="text-3xl font-semibold text-center mb-6">You've been invited to join:</h2>

        <div className="space-y-4 bg-[#282828] p-5 rounded-xl">
          <p className="text-xl">
            <span className="font-semibold">Project:</span> {inviteData?.name}
          </p>
          <p className="text-xl">
            <span className="font-semibold">Builder:</span> {inviteData?.builder}
          </p>
          <p className="text-xl">
            <span className="font-semibold">Location:</span> {inviteData?.city}, {inviteData?.state}
          </p>
        </div>
      </div>

      <button
        onClick={handleGetStarted}
        className="mt-12 px-8 py-3 bg-white text-black text-lg font-semibold rounded-full hover:bg-gray-200 transition-colors duration-300 ease-in-out"
      >
        Get Started
      </button>
    </div>
  )
}

export default WelcomePage

