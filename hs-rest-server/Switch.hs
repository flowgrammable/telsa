{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE RecordWildCards   #-}

module Switch (
  Switch(..)
  ) where

import Control.Applicative
import Control.Monad
import Data.Aeson
import Test.QuickCheck

-- record representing a switch.
data Switch = Switch { switchID   :: Int
                     , switchName :: String
                     } deriving (Show, Eq)

-- The following defines how to convert between Haskell and JSON
-- representations of a Switch record.
instance ToJSON Switch where
    toJSON Switch {..} =
      object
      [ "switchID" .= switchID
      , "switchName" .= switchName
      ]

instance FromJSON Switch where
  parseJSON (Object v) =
    Switch <$>
    v .: "switchID" <*>
    v .: "switchName"
  parseJSON _ = mzero

-- This defines how quickcheck (testing framework) can generate random
-- instances of Switch values for use in tests.
instance Arbitrary Switch where
  arbitrary = do
    x <- arbitrary
    y <- arbitrary
    return $ Switch { switchID = x, switchName = y }