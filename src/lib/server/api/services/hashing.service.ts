import { scrypt } from 'node:crypto'
import { decodeHex, encodeHexLowerCase } from '@oslojs/encoding'
import { constantTimeEqual } from '@oslojs/crypto/subtle'
import { injectable } from 'tsyringe'

@injectable()
export class HashingService {
	private N: number
	private r: number
	private p: number
	private dkLen: number

	constructor() {
		this.N = 16384
		this.r = 16
		this.p = 1
		this.dkLen = 64
	}
	async hash(password: string) {
		const salt = encodeHexLowerCase(crypto.getRandomValues(new Uint8Array(16)))
		const key = await this.generateKey(password, salt)
		return `${salt}:${encodeHexLowerCase(key)}`
	}

	async verify(hash: string, password: string) {
		const [salt, key] = hash.split(':')
		const targetKey = await this.generateKey(password, salt)
		return constantTimeEqual(targetKey, decodeHex(key))
	}

	async generateKey(password: string, salt: string): Promise<Buffer> {
		return await new Promise((resolve, reject) => {
			scrypt(
				password.normalize('NFKC'),
				salt,
				this.dkLen,
				{
					N: this.N,
					p: this.p,
					r: this.r,
					// errors when 128 * N * r > `maxmem` (approximately)
					maxmem: 128 * this.N * this.r * 2,
				},
				(err, buff) => {
					if (err) return reject(err)
					return resolve(buff)
				},
			)
		})
	}
}
