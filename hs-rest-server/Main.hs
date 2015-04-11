{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes       #-}
{-# LANGUAGE TemplateHaskell   #-}
{-# LANGUAGE TypeFamilies      #-}
{-# LANGUAGE RecordWildCards   #-}
{-# LANGUAGE ViewPatterns      #-}

import Switch

import Control.Concurrent.STM
import Yesod

main :: IO ()
main = do
  switchesVar <- newTVarIO []  
  warp 3000 $ App { switchesVar = switchesVar }

-- holds the application state
data App = App { switchesVar :: TVar [Switch] }

-- This declares the resources and the handlers
-- the first one is the get for the switches URL
-- the second defines a addswitch URL to which you can POST.
-- the third defines a switch/<ID> resource which you can DELETE.
mkYesod "App" [parseRoutes|
/switches SwitchesR GET
/addswitch AddSwitch POST
/switch/#Int SwitchR DELETE
|]

-- This declares our App datatype to be an instance of a Yesod
-- (a Haskell web framework that we're using here) web application.
-- This causes Yesod to perform some template haskell functions to 
-- build out boilerplace that we use here. 
instance Yesod App

-- The handlers for the URLs we described above.
getSwitchesR :: Handler TypedContent
getSwitchesR = do
  app <- getYesod
  sws <- liftIO $ atomically $ readTVar (switchesVar app)
  selectRep $ provideRep $ returnJson sws

postAddSwitch :: Handler TypedContent
postAddSwitch = do
  app <- getYesod
  sw <- requireJsonBody
  liftIO $ atomically $ modifyTVar (switchesVar app) $ append sw
  selectRep $ provideRep $ returnJson (0 :: Int)

append :: a -> [a] -> [a]
append a as = a:as

-- Note the Int parameter; it is here because of the way we declared
-- the switch URL to include #Int.
deleteSwitchR :: Int -> Handler TypedContent
deleteSwitchR swID = do
  app <- getYesod
  liftIO $ atomically $ modifyTVar (switchesVar app) $ deleteSwitch swID
  selectRep $ provideRep $ returnJson (0 :: Int)

deleteSwitch :: Int -> [Switch] -> [Switch]
deleteSwitch swID sws = filter ((/= swID) . switchID) sws
