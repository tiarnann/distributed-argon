#!/bin/bash
workers=1 npm -s start &&
workers=1 WorkStealing=true npm -s start &&
workers=2 npm -s start &&
workers=2 WorkStealing=true npm -s start  &&
workers=3 npm -s start &&
workers=3 WorkStealing=true npm -s start  &&
workers=4 npm -s start &&
workers=4 WorkStealing=true npm -s start  &&
workers=5 npm -s start &&
workers=5 WorkStealing=true npm -s start  &&
workers=6 npm -s start &&
workers=6 WorkStealing=true npm -s start  &&
workers=7 npm -s start &&
workers=7 WorkStealing=true npm -s start  &&
workers=8 npm -s start &&
workers=8 WorkStealing=true npm -s start  &&
workers=9 npm -s start &&
workers=9 WorkStealing=true npm -s start  &&
workers=10 npm -s start &&
workers=10 WorkStealing=true npm -s start