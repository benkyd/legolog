
for f in *; do
    if [ -d "$f" ]; then
        echo $f
        tar -czvf $f.tar.gz "$f"/
    fi
done
