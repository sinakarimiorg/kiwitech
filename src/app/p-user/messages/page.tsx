import Layout from '@root/src/components/layouts/UserPanelLayout'
import MessagesList from '@root/src/components/templates/P-user/Messages/MessagesList'
import { getCurrentUser } from '@root/src/lib/auth/session'
import { connectDB } from '@root/src/lib/mongodb'
import { UserMessage } from '@root/src/types/userMessageType'
import { redirect } from 'next/navigation'
import MessageModel from '@root/src/models/Message'
import NewMessageModal from '@root/src/components/templates/P-user/Messages/NewMessageModal'

export const dynamic = 'force-dynamic'

async function page() {
  const user = await getCurrentUser()
  if (!user) redirect('/login-register')

  await connectDB()
  const messages = await MessageModel.find({ user: user._id }).sort({ _id: -1 }).lean()
  const userMessages: UserMessage[] = JSON.parse(JSON.stringify(messages))

  return (
    <Layout>
      <main className='flex-1 min-w-0'>
        <MessagesList messages={userMessages} />
      </main>
    </Layout>
  )
}

export default page;