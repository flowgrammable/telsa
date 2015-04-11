import Switch
import Data.Aeson
import qualified Data.Aeson as Aeson

import Test.Tasty
import Test.Tasty.QuickCheck as QC

main = defaultMain tests

tests :: TestTree
tests = testGroup "Tests" [properties]

properties :: TestTree
properties = testGroup "Properties" [qcProps]

qcProps = testGroup "(checked by QuickCheck)"
  [ QC.testProperty "SwitchRoundTrip" $
    \sw -> fromJSON (toJSON (sw :: Switch)) == Aeson.Success sw
  ]

