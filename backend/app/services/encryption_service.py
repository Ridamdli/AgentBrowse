import os
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from dotenv import load_dotenv

load_dotenv()

class EncryptionService:
    def __init__(self):
        # Get encryption key from environment or generate one
        encryption_key = os.getenv("ENCRYPTION_KEY")
        
        if not encryption_key:
            # Generate a key and save it to .env if not present
            salt = os.urandom(16)
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=100000,
            )
            encryption_key = base64.urlsafe_b64encode(kdf.derive(os.urandom(32)))
            
            # In a production environment, this key should be stored securely
            # and not written to a file on disk
            env_path = os.path.join(os.getcwd(), '.env')
            with open(env_path, 'a') as f:
                f.write(f"\nENCRYPTION_KEY={encryption_key.decode()}\n")
            
            load_dotenv(override=True)
        else:
            # Convert string key to bytes if it's from .env
            if isinstance(encryption_key, str):
                encryption_key = encryption_key.encode()
        
        self.cipher = Fernet(encryption_key)
    
    def encrypt(self, data: str) -> str:
        """Encrypt the data and return the encrypted string"""
        if not data:
            return ""
        
        # Convert to bytes, encrypt, and convert back to string
        encrypted_data = self.cipher.encrypt(data.encode())
        return encrypted_data.decode()
    
    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt the data and return the original string"""
        if not encrypted_data:
            return ""
        
        # Convert to bytes, decrypt, and convert back to string
        decrypted_data = self.cipher.decrypt(encrypted_data.encode())
        return decrypted_data.decode() 