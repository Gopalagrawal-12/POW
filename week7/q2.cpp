//Alternating Add and Subtract without curied function
 // same approach by seitching a boolean variable each time
// time compelxity : O(n)
// space complexity : O(1)

#include <bits/stdc++.h>
using namespace std;

int main(){
    int n;
    cin >> n;
    int sum=0;
    int z;
    cin >> z;
    sum+=z;
    bool f=true;
    for(int i=0;i<n-1;++i){
        int x;
        cin >> x;

        if(f){
            sum+=x;
        }else{
            sum-=x;
        }f=!f;
    }cout << sum << endl;
}
