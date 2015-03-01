
--import System.Console.CmdArgs
import Network hiding(accept)
import Network.Socket (recv, accept, close, send)
import Text.Printf
import Control.Concurrent
import Control.Monad
import qualified Data.Map as Map

data Args = Args {
  serverIP :: String,
  serverPort :: Int
} deriving (Show)

{-
sampleArgs :: Args
sampleArgs = Args {
  serverIP   = "127.0.0.1",
  serverPort = 0
}
-}

args :: Args
args = Args {
  serverIP = "127.0.0.1",
  serverPort = 10000
}

-- child socket handler
client :: Socket -> IO()
client socket = do
  buf <- recv socket 1500
  putStrLn buf
  bytes <- send socket buf
  printf "Sent %d bytes" bytes
  close socket
  return ()

-- socket listener
listener :: Int -> IO ()
listener port = do
  socket <- listenOn $ PortNumber $ fromIntegral port
  let loop :: IO ()
      loop = forever $ do
        (child, _) <- accept socket
        _ <- forkIO $ client child
        return ()
  loop
  sClose socket
  return ()

data Cmd =
  Start Int
  | Finish Int
  | Quit
  deriving(Show, Eq)

-- parse command input
parse :: String -> Maybe Cmd
parse input =
  case input of
    's': rem -> Just $ Start(read rem)
    'f': rem -> Just $ Finish(read rem)
    'q': _   -> Just $ Quit
    _ -> Nothing

-- run the cli loop
cli :: Map.Map Int ThreadId -> IO () 
cli threads = do
  line <- getLine
  let cmd = parse line
  print cmd
  case cmd of
    Just (Start port) -> do
      tid <- forkIO $ listener port
      cli $ Map.insert port tid threads
    Just (Finish port) -> do
      case Map.lookup port threads of
        Just tid -> do 
          killThread tid
          cli $ Map.delete port threads
        Nothing -> cli threads
    Just Quit -> return () 
    _ -> cli threads

main :: IO ()
main = do 
  print args
  cli Map.empty
  return ()

