#!/bin/bash
clear
echo "start searching files"


grep -o -r -h --exclude='*.sh' "polyglot.t(.*)" *  |sed 's/polyglot.t(//g' |sed 's/{.*//g' |sed 's/)//g'| sed 's/[ ,]*$//'|sed -e s/\'//g |sed -e s/\"//g  > search.txt

echo { > atlast.txt 
cat search.txt | while read line
do
 echo "\"$line\"" : "\"\"", 
done |cat >> atlast.txt 
echo } |cat >> atlast.txt
echo ready