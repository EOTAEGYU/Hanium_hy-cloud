import os, sys
import gcp, aws
from common import RestClient

if __name__ == '__main__':

    myfunc = sys._getframe().f_code.co_name
    rest_client = RestClient.RestClient()

    ###########################################################################################
    # GCP 모니터링
    print("#########################")
    print("# GCP 모니터링")

    # gcp service account 에서 생성한 json 키 파일 경로 입력
    gcp.set_credentials('C:\\Users\\wkdrn\\OneDrive\\Hanium_hy-cloud\\PycharmProjects\\hycloud-399403-799ec3774fe3.json')

    project_id = "hycloud-399403"
    results = gcp.get_cpu_utilization(project_id)
    for result in results:
        print(result)
        response = rest_client.restapi_post("http://3.37.10.77:8000/monitor_info", result)


    results = gcp.get_memory_utilization(project_id)
    for result in results:
        print(result)
        response = rest_client.restapi_post("http://3.37.10.77:8000/monitor_info", result)


    #result = gcp.get_process_status(project_id, "7519728534255468535", "./test 12345")
    # print(result)
    response = rest_client.restapi_post("http://3.37.10.77:8000/monitor_info", result)


    ###########################################################################################
    # AWS 모니터링
    print("#########################")
    print("# AWS 모니터링")

    access_key = 'AKIARWZFEUPSCEJUZEMN' # access key 입력
    secret_key = '7z6NN6yTGsXiHAYoHTTZqrqyw7S/bIi7FD84bOtj' # service key 입력
    region_name = 'ap-northeast-2'

    # AWS 자격 증명 설정 및 서비스 사용
    session = aws.set_aws_credentials(access_key, secret_key, region_name)

    instances = aws.get_instance_list(session)
    for instance in instances:
         print(instance)

    # CPU 사용량 조회
    results = aws.get_cpu_utilization(session, instances)
    for result in results:
        print(result)
        response = rest_client.restapi_post("http://3.37.10.77:8000/monitor_info", result)

    # CPU 사용량 조회
    results = aws.get_memory_utilization(session, instances)
    for result in results:
        print(result)
        response = rest_client.restapi_post("http://3.37.10.77:8000/monitor_info", result)


