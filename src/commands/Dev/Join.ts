import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'join',
            description: 'Bot Joins the group',
            category: 'dev',
            dm: true,
            usage: `${client.config.prefix}join`,
            modsOnly: true,
            baseXp: 50
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.urls.length) return void M.reply('Link?')
        const url = M.urls.find((url) => url.includes('chat.whatsapp.com'))
        if (!url) return void M.reply('No WhatsApp Invite URLs found in your message You Idiot ')
        if (this.client.config.mods?.includes(M.sender.jid)) {
            const groups = this.client.chats
                .all()
                .filter((chat) => chat.jid.endsWith('g.us'))
                .map((chat) => chat.jid)
            const s = url.split('/')
            const { status, gid } = await this.client.acceptInvite(s[s.length - 1]).catch(() => ({ status: 401 }))
            if (status === 401) return void M.reply('Cannot join group. Maybe, its a shit group that removed me once baka')
            if (groups.includes(gid)) return void M.reply('Already there Baka')
            return void M.reply(`Joined ${(await this.client.fetchGroupMetadataFromWA(gid)).subject}`)
        }
    }
}
