import bcrypt from 'bcrypt'


class BcryptHelper {
  public static async hashing(password: string, salt: number): Promise<string> {
    return await bcrypt.hash(password, salt)
  }

  public static async compare(password: string, passwordHashed: string) {
    return await bcrypt.compare(password, passwordHashed)
  }
}

export default BcryptHelper