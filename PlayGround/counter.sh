#!/bin/bash
echo $PWD           
upperlim=100

for ((i=0; i<=upperlim; i++)); do
   sleep 1
   echo "$i"
done

