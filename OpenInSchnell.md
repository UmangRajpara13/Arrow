## on Linux

Reimplemented for Sonic Console using the work of code-nautilus by [harry-cpp](https://github.com/harry-cpp/code-nautilus)


#### Add 'Open in Sonic'

```
wget -qO- https://raw.githubusercontent.com/thevoyagingstar/Sonic/main/linux/install.sh | bash
```

#### Remove 'Open in Sonic'

```
rm -f ~/.local/share/nautilus-python/extensions/sonic-nautilus.py

```

## on MacOS
<br/>
1. Create an application in Automator using the following Apple Script. 

```
tell application "Finder"
	set theWindow to window 1
	set thePath to (POSIX path of (target of theWindow as alias))
	set theCommand to "/usr/bin/open -n -b \"com.thevoyagingstar.sonic\" --args " & thePath
	do shell script (theCommand)
end tell
```
<br/>

2. Save it as 'OpenInSonic' or any other name as you like. 
3. Then go to Applications directory in finder and drag the newly created app to finder toolbar while holding command button.
 
<br/>

 ### Add an icon?
 <br/>

1. In Applications directory right click & then select 'Get Info' on this apple script as well as Sonic Console and drag the Sonic's icon to this apple script's icon

## on Windows
sonic automatically adds `Open Sonic here` after installation.
