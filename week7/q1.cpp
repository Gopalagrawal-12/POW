
// approach : by linear search and check prime to only their square root in their range
//Time Complexity = O(n*log2(n))
//Space Complexity = O(2*n)
#include <bits/stdc++.h>
using namespace std;
bool check(int x){
    if(x<=1 ) return false;
    if(x==2) return true;
    if(x%2==0) return false;
    for(int i=3;i*i<=x;i+=2){
        if(x%i==0) return false;
    }return true;
}
int main(){
    int n;
    cin >> n;
    vector<int>v;
    map<int,int>mp;
    for(int i=0;i<n;++i){
        int x;
        cin >> x;
        bool y=check(x);
        if(y) {
            mp[x]++;
            if(mp[x]==2) v.push_back(x);
        }
    }for(int i=0;i<v.size();++i){
        cout << v[i] << endl;
    }
}
