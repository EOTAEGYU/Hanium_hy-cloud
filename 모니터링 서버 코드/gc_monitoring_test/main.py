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

    gcp.set_credentials('C:\\Temp\\poc-jhlee-cadc73bf2cce.json') # gcp service account 에서 생성한 json 키 파일 경로 입력

    project_id = "poc-jhlee"
    results = gcp.get_cpu_utilization(project_id)
    for result in results:
        print(result)
        response = rest_client.restapi_post("http://127.0.0.1:8000/monitor_info", result)


    results = gcp.get_memory_utilization(project_id)
    for result in results:
        print(result)
        response = rest_client.restapi_post("http://127.0.0.1:8000/monitor_info", result)


    result = gcp.get_process_status(project_id, "3361798994575063946", "./test 12345")
    print(result)
    response = rest_client.restapi_post("http://127.0.0.1:8000/monitor_info", result)


    ###########################################################################################
    # AWS 모니터링
    print("#########################")
    print("# AWS 모니터링")

    access_key = '' # access key 입력
    secret_key = '' # service key 입력
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
        response = rest_client.restapi_post("http://127.0.0.1:8000/monitor_info", result)

    # CPU 사용량 조회
    results = aws.get_memory_utilization(session, instances)
    for result in results:
        print(result)
        response = rest_client.restapi_post("http://127.0.0.1:8000/monitor_info", result)


