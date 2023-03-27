import os
import sys
import fileinput

print ("Text to search for:")
textToSearch =  "post" 

print ("Text to replace it with:")
textToReplace =  "p"

print ("File to perform Search-Replace on:")
fileToSearch  =  "../dist/renderer/index.js"

tempFile = open( fileToSearch, 'r+' )

for line in fileinput.input( fileToSearch ):
    if textToSearch in line :
        print('Match Found',textToSearch)
#     else:
#         print('Match Not Found!!')
    tempFile.write( line.replace( textToSearch, textToReplace ) )
tempFile.close()
