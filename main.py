import os
from dotenv import load_dotenv

def main():
    print("Hello from rtdd-django!")



load_dotenv()
sk = os.getenv("SECRET_KEY")
print(sk)

if __name__ == "__main__":
    main()
